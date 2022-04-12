const express = require("express");
const connectdb = require("./src/config/db");
const mainRoute = require("./src/routes/router");

var cors = require("cors");

var PORT = process.env.PORT || 4000;
connectdb();

const app = express();
const server = require("http").createServer(app);
var io = require("socket.io")(server);
var webSocket = require("./src/routes/socket_io/socket_io");
var firebaseFcm = require("./src/routes/firebase_admin/firebase_admin");

process.on("uncaughtException", function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
});

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
webSocket.start(io);
firebaseFcm.start();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse application/json
app.use(express.json());

app.use("/api", mainRoute);

server.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
