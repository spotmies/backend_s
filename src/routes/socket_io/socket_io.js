mongoose = require("mongoose");
const partnerDB = require("../../models/partner/partner_registration_sch");
const responsesDB = require("../../models/responses/responses_sch");
const chatDB = require("../../models/messaging/messaging_sch");
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
          io.to(change.fullDocument.pId)
            .to(change.fullDocument.uId)
            .emit("newChat", change.fullDocument);
          break;
        case "delete":
          console.log("chat deleted>>>");
          io.to(change.fullDocument.pId)
            .to(change.fullDocument.uId)
            .emit("deleteChat", change.documentKey);

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
              partnerDB.find(
                { job: change.fullDocument.job, availability: true },
                (err, data) => {
                  if (err) {
                    console.error(err);
                    return res.status(400).send(err.message);
                  }
                  console.log("socket on for incoming orders >>");
                  data.forEach((element) => {
                    io.to(element.pId).emit(
                      "inComingOrders",
                      change.fullDocument
                    );
                  });
                  console.log("socket off for in orders >>>");
                }
              );
            } catch (error) {}
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

function updateMsgsInDb(data,sender) {
  let msgId = data.target.msgId;
  let newMessage = data.object;
  let updateBlock = {
        $inc: {
        pCount: 22,
        uCount : 23
    }
  };
  // if(sender === "user") updateBlock = { $inc :{'pCount':1}};
  // else updateBlock = { $inc :{'uCount':1}};
  try {
    chatDB.findOneAndUpdate(
      { msgId: msgId },
      { $push: { msgs: newMessage }, lastModified: new Date().valueOf(),updateBlock},
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
  try {
    if(data.sender == "user"){
    chatDB.findOneAndUpdate(
      { msgId: msgId },
      { uState:status,uCount: status===3 ? 0 : 9, },
      { new: true },
      (err, data) => {
        if (err) {
          console.log(err);
        }
      }
    );
    }
    else{

        chatDB.findOneAndUpdate(
      { msgId: msgId },
      { pState:status,pCount: status === 3 ? 0 : 9, },
      { new: true },
      (err, data) => {
        if (err) {
          console.log(err);
        }
      }
    );
  }
  } catch (error) {
    console.log(error);
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
        updateMsgsInDb(data,object.sender);
      });
      socket.on("sendReadReciept",function (data) {
        console.log("got read reciept",data);
        if (data.sender === "user") {
          socket.to(data.pId).emit("recieveReadReciept", data);
        } else {
          socket.to(data.uId).emit("recieveReadReciept", data);
        }
        
      });
    });
  },
};
