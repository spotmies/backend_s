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
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* -------------------------- GET ALL SERVICE LIST -------------------------- */

router.get("/all-service-list", (req, res) => {
  const parmas = req.query;
  console.log("params -> ", parmas);
  const isDeleted = parmas.isDeleted ?? false;
  const isActive = parmas.isActive ?? true;
  try {
    listDB.find({ isDeleted: isDeleted, isActive: isActive }, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
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
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
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
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

module.exports = router;
