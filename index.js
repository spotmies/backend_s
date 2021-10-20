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
var firebaseFcm = require("./src/routes/firebase_admin/firebase_admin");
const { parseParams } = require("./src/helpers/query/parse_params");

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

// app.use(bodyParser.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/api", mainRoute);
app.get("/placesapi", (req, res) => {
  let startLat = "";
  let startLong = "";
  let endLat = "";
  let endLong = "";
  let targetCity = "";
  let currentArea = "";
  let currentPlace = "";
  // let originalUrl = parseParams(req.originalUrl);
  // console.log(originalUrl);
  res.send(originalUrl);

  // let startLat = 17.538455;
  // let startLong = 83.087737;
  // let endLat = 17.934493;
  // let endLong = 83.41598;
  // for (let j = 17.538455; j < endLat; j += j+=0.002000) {
  //   for (var i = 83.087737; i < endLong; i += j+=0.002000) {
  //     valstr1 = j.toString();
  //     valstr2 = i.toString();
  //     console.log(`${valstr1.substring(0, 9)},${valstr2.substring(0, 9)}`);
  //   }
  // }
});
app.get("/getplace/:id", (req, res) => {
  let options = {
    args: [req.params.id, "getplace"], //An argument which can be accessed in the script using sys.argv[1]
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
app.get("/geocode/:id", (req, res) => {
  let options = {
    args: [req.params.id, "getgeocode"], //An argument which can be accessed in the script using sys.argv[1]
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
app.get("/geoJson/:id", (req, res) => {
  res.send("work...");
  let logs = [];
  // let logs = ["17.742016, 83.331103", "17.744915,83.241529"];
  let startLat = 17.538455;
  let startLong = 83.087737;
  let endLat = 17.934493;
  let endLong = 83.41598;
  for (let j = startLat; j < endLat; j += 0.202) {
    for (var i = startLong; i < endLong; i += 0.202) {
      valstr1 = j.toString();
      valstr2 = i.toString();
      console.log(`${valstr1.substring(0, 9)},${valstr2.substring(0, 9)}`);
      logs.push(`${valstr1.substring(0, 9)},${valstr2.substring(0, 9)}`);
    }
  }
  let jsonLogs = JSON.stringify(logs);
  let options = {
    args: [jsonLogs, "geoJson"], //An argument which can be accessed in the script using sys.argv[1]
  };
  console.log("gecode api geojson", jsonLogs);
  let output;
  PythonShell.run("app.py", options, function (err, result) {
    try {
      if (err) throw err;
      console.log("result: ", result);
      output = result[0];

      //res.send(result.toString());
    } catch (error) {
      console.log(error);
      // res.send(error);
      //res.send("unknow place...");
    }
  });
});

server.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
