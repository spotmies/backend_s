const express = require("express");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");
const router = express.Router();
const schema = require("../../models/suggestions/suggesions_sch");
const { sendNotificationToAdmin } = require("../../services/users");

/* ----------------------------- New suggestion ----------------------------- */

router.post("/new-suggestion", (req, res) => {
  const body = req.body;
  try {
    schema.create(body, (err, data) => {
      if (data) {
        sendNotificationToAdmin(
          "suggestion created",
          `sub: ${data.subject} ,for: ${data.suggestionFor}, body: ${data.body}`
        );
      }
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ----------------------------- Get suggestions ---------------------------- */

router.get("/all-suggestions/:id", (req, res) => {
  const typeId = req.params.id;
  const isDeleted = req.query.isDeleted ?? false;
  try {
    schema.find(
      { suggestionFor: typeId, isDeleted: isDeleted },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

router.get("/get-all-suggestions", (req, res) => {
  const isDeleted = req.query.isDeleted ?? false;
  try {
    schema.find({ isDeleted: isDeleted }, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* -------------------------- Get suggestions by id ------------------------- */

router.get("/suggestions/:id", (req, res) => {
  const id = req.params.id;
  try {
    schema.findById(id, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* --------------------------- update suggestions --------------------------- */

router.put("/suggestions/:id", (req, res) => {
  const id = req.params.id;
  let body = req.body;
  body.lastModified = body.lastModified ?? new Date().valueOf();
  try {
    //set only few fields
    schema.findByIdAndUpdate(
      id,
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

module.exports = router;
