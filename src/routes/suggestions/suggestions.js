const express = require("express");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");
const router = express.Router();
const schema = require("../../models/suggestions/suggesions_sch");

/* ----------------------------- New suggestion ----------------------------- */

router.post("/new-suggestion", (req, res) => {
  const body = req.body;
  try {
    schema.create(body, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
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
        return processRequest(err, data, res);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------- Get suggestions by id ------------------------- */

router.get("/suggestions/:id", (req, res) => {
  const id = req.params.id;
  try {
    schema.findById(id, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
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
        return processRequest(err, data, res);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

module.exports = router;
