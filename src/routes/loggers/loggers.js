const express = require("express");
const loggerDB = require("../../models/loggers/loggers_sch");
const router = express.Router();

router.post("/newLogger", (req, res) => {
  const data = req.body;
  try {
    loggerDB
      .create(data)
      .then((doc, err) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (!doc) return res.status(404).json(doc);
        return res.status(200).json(doc);
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send(err.message);
        }
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

router.get("/loggers", (req, res) => {
  try {
    // loggerDB.find({}, (err, data) => {
    //   if (err) {
    //     console.error(err);
    //     return res.status(400).send(err.message);
    //   }
    //   res.status(200).json(data);
    // });
    loggerDB
      .find({})
      .populate("posts")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
