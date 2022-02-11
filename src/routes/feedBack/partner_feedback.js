const express = require("express");
const mongoose = require("mongoose");
const partnerFeedBack = require("../../models/partner_feedback/partner_feedback_sch");
const { addFeedbackIdToOrder } = require("../../services/orders");
const { pushRatingsToPartner } = require("../../services/partners");
const router = express.Router();

/* -------------------------------------------------------------------------- */
/*                      NEW FEEDBACK FOR PARTNER SERVICE                      */
/* -------------------------------------------------------------------------- */
router.post("/new-feedback", (req, res) => {
  const body = req.body;

  try {
    partnerFeedBack
      .create(body)
      .then((doc, err) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        const orderBody = {
          feedBackDetails: doc._id,
          orderState: "10",
        };
        addFeedbackIdToOrder(body.orderDetails, orderBody);
        pushRatingsToPartner(body.pId, doc._id);
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
/*                     UPDATE FEEDBACK FOR PARTNER SERVICE                    */
/* -------------------------------------------------------------------------- */

router.put("/feedbacks/:objectId", (req, res) => {
  const objectId = req.params.objectId;
  const body = req.body;
  try {
    partnerFeedBack.findByIdAndUpdate(
      objectId,
      { $set: body },
      { new: true },
      (err, data) => {
        if (err) {
          //console.error(err);
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
/*                           GET PARTICULAR FEEDBACK                          */
/* -------------------------------------------------------------------------- */
router.get("/feedbacks/:objectId", (req, res) => {
  const objectId = req.params.objectId;
  let originalUrl = req.query;
  try {
    partnerFeedBack
      .findById(objectId, { isDeleted: originalUrl.isDeleted ?? false })
      .populate("uDetails", "name phNum pic eMail uId")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data) return res.sendStatus(404);
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                              GET ALL FEEDBACKS                             */
/* -------------------------------------------------------------------------- */
router.get("/all-feedbacks", (req, res) => {
  // let originalUrl = req.query;
  let originalUrl = req.query;
  try {
    partnerFeedBack
      .find({
        isDeleted: originalUrl.isDeleted ?? false,
      })
      .populate("uDetails", "name phNum pic eMail uId")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data) return res.sendStatus(404);
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                           GET ALL FEEDBACK BY PID                          */
/* -------------------------------------------------------------------------- */

router.get("/feedbacks/partner/:pId", (req, res) => {
  let pId = req.params.pId;
  let originalUrl = req.query;
  try {
    partnerFeedBack
      .find({ pId: pId, isDeleted: originalUrl.isDeleted ?? false })
      .populate("uDetails", "name phNum pic eMail uId")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data) return res.sendStatus(404);
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                          DELETE PARTICUAL FEEDBACK                         */
/* -------------------------------------------------------------------------- */
router.delete("/feedbacks/:objectId", (req, res) => {
  const objectId = req.params.objectId;
  try {
    partnerFeedBack.findByIdAndUpdate(
      objectId,
      { isDeleted: true },
      (err, data) => {
        if (err) return res.status(400).send(err.message);
        if (!data) return res.sendStatus(404);
        return res.sendStatus(204);
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
