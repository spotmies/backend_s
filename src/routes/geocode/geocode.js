const express = require("express");
const router = express.Router();
const geocodeSch = require("../../models/geocode/geocode_schema");

router.get("/all", (req, res) => {
  console.log("all docs request");
  // res.send('GET request to the homepage')
  try {
    geocodeSch.find({}, (err, docs) => {
      if (err) {
        console.error(err);
        return res.status(400).send(err.message);
      }
      if (!docs || docs == null || docs == "")
        return res.status(501).json(docs);

      res.status(200).json(docs);
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/addressLine/:line", (req, res) => {
  const addressLine = req.params.line;
  let params = req.query;
  let limit = params.limit != undefined ? Number(params.limit) : 5;
  let regex = new RegExp(addressLine, "i");
  geocodeSch.find(
    {
      $and: [{ $or: [{ addressLine: regex }, { subLocality: regex }] }],
    },
    null,
    { limit: limit },
    function (err, docs) {
      if (err) return res.status(400).json(err);
      return res.status(200).json(docs);
    }
  );
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
