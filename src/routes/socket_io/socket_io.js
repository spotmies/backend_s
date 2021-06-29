mongoose = require("mongoose");
const partnerDB = require("../../models/partner/partner_registration_sch");
const responsesDB = require("../../models/responses/responses_sch");
const connection = mongoose.connection;
function changeStrema(io) {
  connection.once("open", () => {
    console.log("Setting change streams");
    const responsesChangeStream = connection.collection("responses").watch();
    const orderChangeStream = connection.collection("orders").watch();

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
    orderChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "insert":
          console.log("new order came...", change.fullDocument);
          partnerDB.updateMany(
            { job: change.fullDocument.job, availability: true },
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
          break;
        case "update":
          console.log("orders updated...", change);

        default:
          break;
      }
    });
  });
}
module.exports = {
  start: function (io) {
    changeStrema(io);
    io.on("connection", function (socket) {
      console.log("coneting >>", socket.id);
      socket.on("join-room", (data) => {
        socket.join(data);
        console.log("new room", data);
      });
    });
  },
};
