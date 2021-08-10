const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const geocodeSch = require("../../models/geocode/geocode_schema");

async function isDocExists(addressLane) {
  if (addressLane == null || addressLane == undefined) return true;
  const doesDocExist = await geocodeSch.exists({ addressLine: addressLane });
  console.log("doc state>>", doesDocExist);
  return doesDocExist;
}

router.get("/addressLine/:line", (req, res) => {
  const line = req.params.line;
  console.log("ge api");
  geocodeSch.find(
    { addressLine: { $regex: line, $options: "i" } },
    function (err, docs) {
      if (err) return res.status(400).json("something worng");
      return res.status(200).json(docs);
    }
  );

  // res.send('GET request to the homepage')
});
router.post("/newgeocode", function async(req, res) {
  // console.log(req.body);
  console.log("new post");
  var inputData = req.body;
  // console.log(inputData);
  var parsedData = JSON.parse(inputData.data);
  //  console.log(parsedData)
  var counter = 0;
  parsedData.forEach((element) => {
    // console.log(element.coordinates);
    geocodeSch.find({ addressLine: element.addressLine }, function (err, docs) {
      if (err) {
        console.log("error while finding", err);
        return res.status(400).json("something worng");
      }
      counter = counter + 1;
      if (docs.length < 1) {
        geocodeSch.create(element).then((doc, err) => {
          if (err) {
            console.log("went wrong", err);

            return res.status(400).json("something worng");
          }
          //  console.log(`doc>> ${doc}`);

          console.log("doc created>>>>>>>>>>>>>>");
          // if (counter == parsedData.length - 1) {
          //   counter = 0;
          //   console.log("data saved");
          //   return res.status(200).json(doc);
          // }
        });
      } else {
        console.log(
          "doc exists>>>>>>",
          "counter>>",
          counter,
          "len",
          parsedData.length
        );
        // if (counter == parsedData.length - 1) {
        //   counter = 0;
        //   console.log("data no >>saved");
        //   return res.status(200).json(parsedData[parsedData.length - 1]);
        // }
      }
      // if (counter == parsedData.length - 1) {
      //   counter = 0;
      //   console.log("data no >>saved");
      //   return res.status(200).json(parsedData[parsedData.length - 1]);
      // }
    });
  });
  console.log("completed>>>>");
  return res.status(200).json(parsedData[parsedData.length - 1]);

  // if(counter==parsedData.length-1){
  //   console.log("data saved");
  //   return res.status(200).json("doc");
  // }
  // res.send('POST request to the homepage')
});
router.get("/newgeocode", (req, res) => {
  console.log("get request");
  res.send("GET request to the homepage");
});

module.exports = router;
