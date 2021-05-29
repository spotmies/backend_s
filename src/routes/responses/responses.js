const express = require("express");
const router = express.Router();
const responsesDB = require("../../models/responses/responses_sch");
const constants = require("../../helpers/constants");

/* -------------------------------------------------------------------------- */
/*                          CREATE RESPONSE FOR USER                          */
/* -------------------------------------------------------------------------- */
router.post(`/${constants.newResponse}`, (req, res, next) => {
  const data = req.body;
  console.log("post resp", data);
  try {
    responsesDB
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

/* -------------------------------------------------------------------------- */
/*                         GET RESPONSE BY RESPONSE ID                        */
/* -------------------------------------------------------------------------- */

router.get(`/${constants.responses}/:ID`, (req, res) => {
  const ID = req.params.ID;

  try {
    responsesDB
      .findOne({ responseId: ID })
      .populate("orderDetails")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                       UPDATE RESPONSE BY RESPONSE ID                       */
/* -------------------------------------------------------------------------- */
router.put(`/${constants.responses}/:ID`, (req, res, next) => {
  const ID = req.params.ID;
  const body = req.body;
  try {
    responsesDB.findOneAndUpdate(
      { responseId: ID },
      body,
      { new: true },
      (err, data) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (!data) return res.status(404).json(data);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                       DELETE RESPONSE BY RESPONSE ID                       */
/* -------------------------------------------------------------------------- */
router.delete(`/${constants.responses}/:ID`, (req, res) => {
  const ID = req.params.ID;
  try {
    responsesDB.findOneAndRemove({ responseId: ID }, (err) => {
      if (err) {
        return res.status(400).send(err.message);
      } else {
        responsesDB.findOne({ responseId: ID }, (err, doc) => {
          if (!doc) {
            return res.status(200).send("doc deleted");
          } else return res.status(400).send("not deleted");
        });
      }
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                      LIST OF RESPONSES BY UID AND PID                      */
/* -------------------------------------------------------------------------- */
router.get(`/:userType/:uId`, (req, res) => {
  const uId = req.params.uId;
  const userType =
    req.params.userType == constants.user
      ? "uId"
      : req.params.userType == constants.partner
      ? "pId"
      : null;
  console.log(userType, uId);
  try {
    responsesDB
      .find({ [userType]: uId })
      .populate("orderDetails")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data || data == null || data == "")
          return res.status(404).json(data);
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                              GET ALL RESPONSES                             */
/* -------------------------------------------------------------------------- */
router.get(`/${constants.responses}`, (req, res) => {
  try {
    responsesDB
      .find({})
      .populate("orderDetails")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
