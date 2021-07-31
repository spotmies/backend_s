const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const NodeGeocoder = require("node-geocoder");
const { PythonShell } = require("python-shell");
router.get("/:id", (req, res, next) => {
  console.log("geocode running", req.params.id);
  //Here are the option object in which arguments can be passed for the python_test.js.
  let options = {
    mode: "text",
    pythonOptions: ["-u"], // get print results in real-time
    scriptPath: "./",
    //If you are having python_test.py script in same folder, then it's optional.
    args: ["shubhamk314"], //An argument which can be accessed in the script using sys.argv[1]
  };

  PythonShell.run("app.py", null, function (err, result) {
    if (err) throw err;
    // result is an array consisting of messages collected
    //during execution of script.
    console.log("result: ");
    // res.send(result.toString());
  });
});

module.exports = router;
