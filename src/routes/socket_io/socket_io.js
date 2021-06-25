mongoose = require("mongoose");
const connection = mongoose.connection;
function changeStrema(io) {
  connection.once("open", () => {
    console.log("MongoDB database connected");

    console.log("Setting change streams");
    const thoughtChangeStream = connection.collection("responses").watch();

    thoughtChangeStream.on("change", (change) => {
      switch (change.operationType) {
        case "insert":
          //   console.log(change);
          //   const thought = {
          //     _id: change.fullDocument._id,
          //     name: change.fullDocument.name,
          //     description: change.fullDocument.description,
          //   };

          io.to(change.fullDocument.uId).emit(
            "newResponse",
            change.fullDocument
          );
          break;

        case "delete":
          io.of("/api/socket").emit("deletedThought", change.documentKey._id);
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
