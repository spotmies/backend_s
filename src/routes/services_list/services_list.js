const express = require("express");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");
const router = express.Router();
const listDB = require("../../models/services_list/services_list_schema");

/* ------------------------ CREATE A NEW SERVICE LIST ----------------------- */

router.post("/new-service-list", (req, res) => {
  const body = req.body;
  try {
    listDB.create(body, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------- GET ALL SERVICE LIST -------------------------- */

router.get("/all-service-list", (req, res) => {
  const parmas = req.query;
  const isDeleted = parmas.isDeleted ?? false;
  const isActive = parmas.isActive ?? true;
  try {
    listDB.find({ isDeleted: isDeleted, isActive: isActive }, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* --------------------------- UPDATE SERVICE LIST -------------------------- */

router.put("/services-list/:docId", (req, res) => {
  const body = req.body;
  const docId = req.params.docId;
  try {
    listDB.findByIdAndUpdate(
      docId,
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

/* --------------------------- DELETE SERVICE LIST -------------------------- */

router.delete("/services-list/:docId", (req, res) => {
  const docId = req.params.docId;
  try {
    listDB.findByIdAndUpdate(
      docId,
      { $set: { isDeleted: true } },
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
