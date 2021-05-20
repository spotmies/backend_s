const express = require("express");
const mongoose = require("mongoose");
const connectdb = require("./src/config/db");
const mainRoute = require("./src/routes/router");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;
connectdb();

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/api", mainRoute);

app.listen(PORT, function () {
  console.log(`app running on port ${PORT}`);
});
