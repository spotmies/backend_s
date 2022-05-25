mongoose = require("mongoose");
const partnerDB = require("../../models/partner/partner_registration_sch");
const responsesDB = require("../../models/responses/responses_sch");
const chatDB = require("../../models/messaging/messaging_sch");
const orderDB = require("../../models/orders/create_service_sch");
const { notificationByToken } = require("../firebase_admin/firebase_admin");
const { checkOrdersForwardAutomation } = require("../../services/settings");
const { sendNotificationByPid } = require("../../services/partners");
const { sendNotificationByUid } = require("../../services/users");
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
                "name eMail phNum partnerPic rate lang experience job loc businessName accountType availability partnerDeviceToken"
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
    orderChangeStream.on("change", async (change) => {
      switch (change.operationType) {
        case "insert":
          console.log("new order came...", change.fullDocument);
          sendNotificationByUid(
            "BkkjgGBculhaoDRyxHd0RnbUp8H3",
            "new order created",
            change?.fullDocument?.problem
          );

          sendNotificationByUid(
            "Lz7SJsnDcZefgoc69Ik5vgL6meb2",
            "new order created",
            change?.fullDocument?.problem
          );
          let automation = await checkOrdersForwardAutomation();
          console.log("automation", automation);
          if (automation == true && change.fullDocument.isBooking == false) {
            console.log("order automation is ON");
            broadCastOrder({ orderData: change.fullDocument, io: io });
          }
          if (change.fullDocument.isBooking == true) {
            console.log("send notification to partner");
            sendNotificationByPid(
              change.fullDocument.pId,
              "Alert",
              "You got new order please check in your order tab"
            );
          }
          // broadCastOrder({
          //   orderData: change.fullDocument,
          //   io: io,
          // });

          break;
        case "update":
          console.log("orders updated...", change);
          orderUpdateStream(io, change);

        default:
          break;
      }
    });
  });
}

function orderUpdateStream(io, updateData) {
  try {
    if (
      updateData.updateDescription?.updatedFields?.orderState == undefined ||
      updateData.updateDescription?.updatedFields?.orderState == null
    ) {
      console.log("return ing");
      return;
    }
    switch (updateData.updateDescription?.updatedFields?.orderState) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 9:
      case 10:
        break;
      case 8:
        orderDB.findById(updateData?.documentKey?._id, (err, docData) => {
          if (err) return;
          if (docData) {
            docData.orderSendTo.forEach((pid) => {
              console.log("notifying partners");
              io.to(pid).emit("inComingOrders", { action: "refress" });
            });
          }
        });
        // array.forEach((pid) => {
        //   console.log("notifying partners");
        //   io.to(pid).emit("inComingOrders", { action: "refress" });
        // });
        break;

      default:
        break;
    }
  } catch (error) {
    console.log("error 189", error);
  }
}
function broadCastOrder({ orderData, res, io } = {}) {
  try {
    partnerDB.updateMany(
      { job: orderData.job, availability: true },
      {
        $addToSet: { inComingOrders: orderData._id },
      },
      function (err, doc) {
        if (err) {
          console.log(`problem with assign order ${err}`);
          if (res != undefined || res != null)
            return res.status(400).send(err.message);
        } else {
          console.log("order assigned : ");
        }
      }
    );
    try {
      orderDB
        .findById(orderData._id)
        .populate(
          "uDetails",
          "name phNum uId userState altNum eMail pic lastLogin userDeviceToken"
        )
        .exec(function (err, orderData) {
          if (err) {
            console.error(err);
            if (res != undefined || res != null)
              return res.status(400).send(err.message);
          }
          if (orderData) {
            try {
              partnerDB.find(
                { job: orderData.job, availability: true },

                (err, partnersData) => {
                  if (err) {
                    console.error(err);
                    if (res != undefined || res != null)
                      return res.status(400).send(err.message);
                  }
                  console.log("socket on for incoming orders >>", orderData);
                  let pIdsArray = [];
                  partnersData.forEach((element) => {
                    io.to(element.pId).emit("inComingOrders", {
                      action: "new",
                      payload: orderData,
                    });
                    pIdsArray.push(element.pId);
                    notificationByToken({
                      token: element.partnerDeviceToken,
                      title: "New order For you",
                      body: orderData.problem,
                      data: {
                        problem: `${orderData.problem}`,
                        money: orderData.money ? `${orderData.money}` : "",
                        ordId: `${orderData.ordId}`,
                        media: orderData.media[0]
                          ? `${orderData.media[0]}`
                          : "",
                        schedule: `${orderData.schedule}`,
                      },
                    });
                  });
                  // updateSendpIdToOrder(orderData._id, pIdsArray);
                  orderDB.updateOne(
                    { _id: orderData._id },
                    {
                      $addToSet: {
                        orderSendTo: { $each: pIdsArray },
                      },
                    },
                    function (err) {
                      if (err) {
                        console.log("error while adding incoming partner");
                        console.log(err);
                        if (res != undefined || res != null)
                          return res.status(400).send(err.message);
                      } else {
                        console.log("Successfully added");
                        if (res != undefined || res != null)
                          return res.statusCode(204);
                      }
                    }
                  );
                  console.log("socket off for in orders >>>");
                }
              );
            } catch (error) {
              console.log("something went wrong110 ", error);
              if (res != undefined || res != null)
                return res.status(500).send(error.message);
            }
          }
        });
    } catch (error) {
      console.log("something went wrong at 115", error);
      if (res != undefined || res != null)
        return res.status(500).send(error.message);
    }
  } catch (error) {
    console.log("error updating incoming order to partner", error);
    if (res != undefined || res != null)
      return res.status(500).send(error.message);
  }
}
function updateSendpIdToOrder(docId, pIdsArray) {
  console.log(docId, pIdsArray);
  orderDB.updateOne(
    { _id: docId },
    { $addToSet: { orderSendTo: { $each: pIdsArray } } },
    function (err) {
      if (err) {
        console.log("error while adding incoming partner");
        console.log(err);
      } else {
        console.log("Successfully added");
      }
    }
  );
  // orderDB.findByIdAndUpdate(
  //   docId,
  //   { $pushAll: { orderSendTo: pIdsArray } },
  //   function (err) {
  //     if (err) {
  //       console.log("error while adding incoming partner");
  //       console.log(err);
  //     } else {
  //       console.log("Successfully added");
  //     }
  //   }
  // );
}
// orderDB.findOneAndUpdate(
//   { ordId: ordId },
//   { $pushAll: { orderSendTo: pIdsArray } }
// );

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
  let msgId = data?.msgId;
  let status = data?.status;
  let updateBlock = {};
  if (data?.sender === "user") {
    if (status === 3) {
      updateBlock.uCount = 0;
    }
    updateBlock.pState = status;
  } else if (data?.sender === "partner") {
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
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function disableOrDeleteChat(object) {
  let msgId = object?.msgId;
  let updateBlock = {};
  updateBlock.cBuild = 0;
  if (object?.type == "delete") {
    if (object?.sender == "user") updateBlock.isDeletedForUser = true;
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
function notificationBodyType({ msg, type } = {}) {
  switch (type) {
    case "text":
    case "message":
      return msg;
    case "call":
      return "Incoming Call";
    case "file":
      return "send a file";
    case "image":
      return "send a image";
    case "video":
      return "send a video";

    default:
      return msg;
  }
}
module.exports = {
  broadCastanOrder: broadCastOrder,
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
          .to(data?.target?.uId)
          .to(data?.target?.pId)
          .emit("recieveNewMessage", data);
        updateMsgsInDb(data);
      });

      socket.on("sendNewMessageCallback", function (data, callBack) {
        console.log("ack", data);
        let object = JSON.parse(data?.object);
        let notificationData = data?.target;
        let deviceTokens = data?.target?.deviceToken;
        delete notificationData?.deviceToken;

        if (object?.sender === "user") {
          socket.to(data?.target?.pId).emit("recieveNewMessage", data);
        } else if (object?.sender === "partner") {
          socket.to(data?.target?.uId).emit("recieveNewMessage", data);
        } else {
          socket.to(data?.target?.pId).emit("recieveNewMessage", data);
          socket.to(data?.target?.uId).emit("recieveNewMessage", data);
        }
        callBack("success");
        updateMsgsInDb(data, object?.sender);

        deviceTokens?.forEach((singleToken) => {
          if (
            singleToken == null ||
            singleToken == undefined ||
            singleToken == ""
          )
            return;
          notificationByToken({
            title: data?.target?.incomingName,
            // body: object?.msg,
            body: notificationBodyType({ msg: object?.msg, type: object.type }),
            data: data?.target,
            token: singleToken,
          });
        });
      });
      socket.on("sendReadReciept", function (data) {
        console.log("got read reciept", data);
        if (data.sender === "user") {
          socket.to(data?.pId).emit("recieveReadReciept", data);
        } else {
          socket.to(data?.uId).emit("recieveReadReciept", data);
        }
        updateMsgStatesAndCountsInDb(data);
      });
      socket.on("chatStream", function (data, callBack) {
        console.log("chatstream on sock", data);
        switch (data?.type) {
          case "disable":
          case "delete":
            socket.to(data?.pId).emit("chatStream", data);
            callBack("success");
            disableOrDeleteChat(data);
            break;
          case "revealProfile":
            callBack("success");
            socket.to(data?.pId).emit("chatStream", data);
          default:
            callBack("wentWrong");
            break;
        }
      });
      socket.on("broadCastOrder", function (data, callBack) {
        try {
          orderDB.findOne({ ordId: data.ordId }).exec(function (err, doc) {
            if (err) {
              console.error(err);
              callBack(err.message);
              // return res.status(400).send(err.message);
            }
            callBack("success");
            broadCastOrder({ orderData: doc, io: io });
          });
        } catch (error) {
          console.log(error.message);
          callBack(error.message);
        }
      });
    });
  },
};
