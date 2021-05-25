const express = require("express");
const mongoose = require("mongoose");
const feedback = require("../../models/feedBack/feedback");
const router = express.Router();

/* -------------------------------------------------------------------------- */
/*             feedback  contactus  partner pre registraion                   */
/* -------------------------------------------------------------------------- */
router.post("/:id", (req, res, next) => {
  const docId = req.params.id;
  console.log("Got body:", req.body);

  const userUpdate = {
    lastModified: new Date(),
    $push: { body: req.body.body },
  };

  try {
    feedback.findOneAndUpdate(
      { docId: docId },
      userUpdate,
      { new: true },
      (err, data) => {
        if (err) {
          console.log("err", err);
          return res.status(400).send("unable to save data");
        } else {
          console.log("data");
          if (data != null) return res.status(200).send("saved");
          else {
            return res.status(400).send("not saved");
          }
        }
      }
    );
  } catch (error) {
    console.log("cathc", error);
    next({ status: 500, message: error });
  }
});

//get data by docid ex: partnerregistraiton,contactus,feedback
router.get("/:id", (req, res) => {
  try {
    feedback.findOne({ docId: req.params.id }, (err, data) => {
      if (err) {
        console.error(err);
        res.status(400).send("unable to load data");
      }
      res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).send("bad req");
  }
});

//get all documents inside feedback collection
router.get("/", (req, res) => {
  try {
    feedback.find({}, (err, data) => {
      if (err) {
        console.error(err);
        res.status(400).send("unable to load data");
      }
      res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).send("bad req");
  }
});

module.exports = router;
