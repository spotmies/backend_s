const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const geocodeSch = require("../../models/geocode/geocode_schema");

router.post('/newgeocode', function (req, res) {
  // console.log(req.body);
  console.log("new post");
  var inputData = req.body;
  // console.log(inputData);
  var parsedData = JSON.parse(inputData.data);
//  console.log(parsedData)
var counter = 0;
  parsedData.forEach(element => {
    // console.log(element.coordinates);
   geocodeSch.create(element).then((doc,err) =>{
     if(err)console.log("went wrong");
    //  console.log(`doc>> ${doc}`);
     counter = counter +1;
   })
  });
  if(counter==parsedData.length-1){
    console.log("data saved");
    return res.status(200).json("doc");
  }
  // res.send('POST request to the homepage')
})
router.get('/newgeocode', (req, res) => {
  console.log("get request");
  res.send('GET request to the homepage')
})


module.exports = router;