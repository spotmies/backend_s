const express = require("express");
const db = require("../../models/suggestions/feedback_questions");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");
const router = express.Router();

/* --------------------- Create a new feedback questions -------------------- */

router.post("/new-feedback-questions", (req, res) => {
  const body = req.body;
  try {
    db.create(body, (err, doc) => {
      return processRequest(err, doc, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* --------------------- Update feedback question by id --------------------- */

router.put("/feedback-questions/:objectId", (req, res) => {
  const objectId = req.params.objectId;
  const body = req.body;
  try {
    db.findByIdAndUpdate(
      objectId,
      { $set: body },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ----------------------- Get feedback question by id ---------------------- */

router.get("/feedback-questions/:objectId", (req, res) => {
  const objectId = req.params.objectId;
  try {
    db.findById(objectId, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ----------------------- Get all feedback questions ----------------------- */
router.get("/all-feedback-questions", (req, res) => {
  const isDeleted = req.query.isDeleted ?? false;
  const isActive = req.query.isActive ?? true;
  try {
    db.find({ isActive: isActive, isDeleted: isDeleted }, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

module.exports = router;
