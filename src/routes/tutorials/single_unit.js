const express = require("express");
const router = express.Router();
const constants = require("../../helpers/constants");
const unitDB = require("../../models/tutorials/single_unit_schema");
const { parseParams } = require("../../helpers/query/parse_params");

/* ---------------------- CREATE NEW UNIT FOR TUTORIAL ---------------------- */

router.post(constants.newUnit, (req, res) => {
  const body = req.body;
  try {
    unitDB.create(body, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error);
  }
});

/* --------------------------- GET UNIT BY UNIT ID -------------------------- */

router.get(`${constants.units}/:unitId`, (req, res) => {
  const unitId = req.params.unitId;
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    unitDB.findOne({ unitId: unitId, isDeleted: isDeleted }, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* ------------------------- UPDATE UNIT BY UNIT ID ------------------------- */

router.put(`${constants.units}/:unitId`, (req, res) => {
  const unitId = req.params.unitId;
  const body = req.body;
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    unitDB.findOneAndUpdate(
      { unitId: unitId, isDeleted: isDeleted },
      { $set: body },
      (err, data) => {
        return processRequest(err, data, res);
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
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    unitDB.findOneAndUpdate(
      { unitId: unitId, isDeleted: isDeleted },
      { $push: { topics: body } },
      {new : true},
      (err, data) => {
        return processRequest(err, data, res);
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
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    unitDB.findOneAndUpdate(
      { unitId: unitId, isDeleted: isDeleted },
      { $pull: { topics: { topicName: topicName } } },
        { new: true },
      (err, data) => {
        return processRequest(err, data, res);
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
            { unitId: unitId},
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


function processRequest(err, data, res) {
  if (err) {
    return res.status(400).json(err.message);
  }
  if (!data) return res.status(404).json({ message: "No data found" });
  return res.status(200).json(data);
}

function catchFunc(error, res) {
  return res.status(500).json({
    message: "Internal Server Error",
    error: error.message,
  });
}
module.exports = router;
