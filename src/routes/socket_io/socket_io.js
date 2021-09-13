mongoose = require("mongoose");
const partnerDB = require("../../models/partner/partner_registration_sch");
const responsesDB = require("../../models/responses/responses_sch");
const chatDB = require("../../models/messaging/messaging_sch");
const orderDB = require("../../models/orders/create_service_sch");
const connection = mongoose.connection;
function changeStrema(io) {
  connection.once("open", () => {
    console.log("Setting change streams");
    const responsesChangeStream = connection.collection("responses").watch();
    const orderChangeStream = connection.collection("orders").watch();
    const chatChangeStream = connection.collection("messagings").watch();

    responsesChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "insert":
          console.log("new resp came >>>");
          try {
            responsesDB
              .findById(change.fullDocument._id)
              .populate("orderDetails")
              .populate(
                "pDetails",
                "name eMail phNum partnerPic rate lang experience job loc businessName accountType availability"
              )
              .exec(function (err, data) {
                if (err) {
                  console.error(err);
                }
                if (data) {
                  io.to(data.uId).emit("newResponse", data);
                }
              });
          } catch (error) {
            console.log(error);
          }

          break;

        case "delete":
          io.of("/api/socket").emit("deletedThought", change.documentKey._id);
          break;
      }
    });
    chatChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "insert":
          console.log("new chat conversion>>>>");
          let object = {
            type: "insert",
            doc: change.fullDocument,
          };
          io.to(change.fullDocument.pId).emit("chatStream", object);
          break;
        case "delete":
          console.log("chat deleted>>>");

        default:
          break;
      }
    });
    orderChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "insert":
          console.log("new order came...", change.fullDocument);
          try {
            partnerDB.updateMany(
              { job: change.fullDocument.job },
              {
                $push: { inComingOrders: change.fullDocument._id },
              },
              function (err, doc) {
                if (err) {
                  console.log(`problem with assign order ${err}`);
                } else {
                  console.log("order assigned : ");
                }
              }
            );
            try {
              orderDB
                .findById(change.fullDocument._id)
                .populate(
                  "uDetails",
                  "name phNum uId userState altNum eMail pic lastLogin"
                )
                .exec(function (err, orderData) {
                  if (err) {
                    console.error(err);
                  }
                  if (orderData) {
                    try {
                      partnerDB.find(
                        { job: change.fullDocument.job, availability: true },

                        (err, data) => {
                          if (err) {
                            console.error(err);
                            return res.status(400).send(err.message);
                          }
                          console.log(
                            "socket on for incoming orders >>",
                            orderData
                          );
                          data.forEach((element) => {
                            io.to(element.pId).emit(
                              "inComingOrders",
                              orderData
                            );
                          });
                          console.log("socket off for in orders >>>");
                        }
                      );
                    } catch (error) {
                      console.log("something went wrong110 ", error);
                    }
                  }
                });
            } catch (error) {
              console.log("something went wrong at 115", error);
            }
          } catch (error) {
            console.log("error updating incoming order to partner", error);
          }
          break;
        case "update":
          console.log("orders updated...", change);

        default:
          break;
      }
    });
  });
}

function updateMsgsInDb(data, sender) {
  let msgId = data?.target?.msgId;
  console.log("msg id ", msgId);
  if (msgId === null || msgId === undefined || msgId === "") return;
  let newMessage = data.object;
  let updateBlock = {};
  let updateBlock2 = {};
  if (sender === "user") {
    updateBlock.pCount = 1;
    updateBlock2.uState = 1;
  } else {
    updateBlock.uCount = 1;
    updateBlock2.pState = 1;
  }
  try {
    chatDB.findOneAndUpdate(
      { msgId: msgId },
      {
        $push: { msgs: newMessage },
        pState: 1,
        uState: 1,
        lastModified: new Date().valueOf(),
        $inc: updateBlock,
      },
      { new: true },
      (err, data) => {
        if (err) {
          console.log(err);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}
function updateMsgStatesAndCountsInDb(data) {
  let msgId = data.msgId;
  let status = data.status;
  let updateBlock = {};
  if (data.sender === "user") {
    if (status === 3) {
      updateBlock.uCount = 0;
    }
    updateBlock.pState = status;
  } else if (data.sender === "partner") {
    if (status === 3) {
      updateBlock.pCount = 0;
    }
    updateBlock.uState = status;
  }
  try {
    chatDB.findOneAndUpdate(
      { msgId: msgId },
      updateBlock,
      { new: true },
      (err, data) => {
        if (err) {
          console.log(err);
        }
        console.log(data.uCount);
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function disableOrDeleteChat(object) {
  let msgId = object.msgId;
  let updateBlock = {};
  updateBlock.cBuild = 0;
  if (object.type == "delete") {
    if (object.sender == "user") updateBlock.isDeletedForUser = true;
    else updateBlock.isDeletedForPartner = true;
    updateBlock.lastModified = new Date().valueOf();
  }
  try {
    chatDB.findOneAndUpdate({ msgId: msgId }, updateBlock, (err, data) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (error) {
    console.log("error at 216", error);
  }
}
module.exports = {
  start: function (io) {
    changeStrema(io);
    io.on("connection", function (socket) {
      console.log("coneting >>", socket.id);
      //join user to socker room
      socket.on("join-room", (data) => {
        socket.join(data);
        console.log("new room", data);
      });

      //join partner to socket room
      socket.on("join-partner", (data) => {
        socket.join(data);
        console.log("new partner joinded", data);
      });

      //message from user to partner
      socket.on("sendNewMessage", (data) => {
        console.log("new msg", data);
        socket
          .to(data.target.uId)
          .to(data.target.pId)
          .emit("recieveNewMessage", data);
        updateMsgsInDb(data);
      });

      socket.on("sendNewMessageCallback", function (data, callBack) {
        console.log("ack", data);
        let object = JSON.parse(data.object);
        if (object.sender === "user") {
          socket.to(data.target.pId).emit("recieveNewMessage", data);
        } else {
          socket.to(data.target.uId).emit("recieveNewMessage", data);
        }
        callBack("success");
        updateMsgsInDb(data, object.sender);
      });
      socket.on("sendReadReciept", function (data) {
        console.log("got read reciept", data);
        if (data.sender === "user") {
          socket.to(data.pId).emit("recieveReadReciept", data);
        } else {
          socket.to(data.uId).emit("recieveReadReciept", data);
        }
        updateMsgStatesAndCountsInDb(data);
      });
      socket.on("chatStream", function (data, callBack) {
        console.log("chatstream on sock", data);
        switch (data.type) {
          case "disable":
          case "delete":
            socket.to(data.pId).emit("chatStream", data);
            callBack("success");
            disableOrDeleteChat(data);
            break;
          default:
            callBack("wentWrong");
            break;
        }
      });
    });
  },
};
