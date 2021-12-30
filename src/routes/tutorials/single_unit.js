const express = require("express");
const router = express.Router();
const constants = require("../../helpers/constants");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");
const unitDB = require("../../models/tutorials/single_unit_schema");

/* ---------------------- CREATE NEW UNIT FOR TUTORIAL ---------------------- */

router.post(constants.newUnit, (req, res) => {
  const body = req.body;
  try {
    unitDB.create(body, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error);
  }
});

/* --------------------------- GET UNIT BY UNIT ID -------------------------- */

router.get(`${constants.units}/:unitId`, (req, res) => {
  const unitId = req.params.unitId;
  let originalUrl = req.query;
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    unitDB.findOne({ unitId: unitId, isDeleted: isDeleted }, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* ------------------------- UPDATE UNIT BY UNIT ID ------------------------- */

router.put(`${constants.units}/:unitId`, (req, res) => {
  const unitId = req.params.unitId;
  const body = req.body;
  let originalUrl = req.query;
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    unitDB.findOneAndUpdate(
      { unitId: unitId, isDeleted: isDeleted },
      { $set: body },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------- ADD NEW TOPIC TO UNIT ------------------------- */

router.post(`${constants.newTopic}/:unitId`, (req, res) => {
  const unitId = req.params.unitId;
  const body = req.body;
  let originalUrl = req.query;
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    unitDB.findOneAndUpdate(
      { unitId: unitId, isDeleted: isDeleted },
      { $push: { topics: body } },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* ------------------------- REMOVE TOPIC FROM UNIT ------------------------- */

router.delete(`${constants.removeTopic}/:unitId`, (req, res) => {
  const unitId = req.params.unitId;
  const topicName = req.body.topicName;
  let originalUrl = req.query;
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    unitDB.findOneAndUpdate(
      { unitId: unitId, isDeleted: isDeleted },
      { $pull: { topics: { topicName: topicName } } },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* ------------------------- DELETE UNIT BY UNIT ID ------------------------- */

router.delete(`${constants.units}/:unitId`, (req, res) => {
  const unitId = req.params.unitId;
  try {
    unitDB.findOneAndUpdate(
      { unitId: unitId },
      { $set: { isDeleted: true } },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

module.exports = router;
