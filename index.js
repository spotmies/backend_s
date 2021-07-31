const express = require("express");
const mongoose = require("mongoose");
const connectdb = require("./src/config/db");
const mainRoute = require("./src/routes/router");
const { PythonShell } = require("python-shell");

var bodyParser = require("body-parser");
var cors = require("cors");

var PORT = process.env.PORT || 4000;
connectdb();

const app = express();
const server = require("http").createServer(app);
var io = require("socket.io")(server);
var webSocket = require("./src/routes/socket_io/socket_io");

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  next();
});
webSocket.start(io);

// app.use(bodyParser.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/api", mainRoute);
app.get("/geocode/:id", (req, res) => {
  let options = {
    args: [req.params.id], //An argument which can be accessed in the script using sys.argv[1]
  };
  console.log("gecode api", req.params.id);

  PythonShell.run("app.py", options, function (err, result) {
    try {
      if (err) throw err;
      // result is an array consisting of messages collected
      //during execution of script.
      console.log("result: ", result);
      res.send(result.toString());
    } catch (error) {
      console.log(error);
      // res.send(error);
      res.send("unknow place...");
    }
  });
});

server.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
