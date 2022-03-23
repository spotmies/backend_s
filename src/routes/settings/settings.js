const express = require("express");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");
const router = express.Router();
const settingsSchema = require("../../models/settings/settings");

/* ------------------------ CREATE A NEW SETTINGS ----------------------- */

router.post("/new-setting", (req, res) => {
  const body = req.body;
  try {
    settingsSchema.create(body, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* -------------------------- GET ALL SETTINGS -------------------------- */

router.get("/all-settings", (req, res) => {
  const parmas = req.query;
  const isDeleted = parmas.isDeleted ?? false;
  const isActive = parmas.isActive ?? true;
  try {
    settingsSchema.find(
      { isDeleted: isDeleted, isActive: isActive },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* --------------------------- UPDATE SETTINGS -------------------------- */

router.put("/:setting", (req, res) => {
  let body = req.body;
  const setting = req.params.setting;
  body.lastModified = new Date().valueOf();
  try {
    settingsSchema.findOneAndUpdate(
      { name: setting },
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

/* --------------------------- GET SETTING BY NAME -------------------------- */

router.get("/:setting", (req, res) => {
  const setting = req.params.setting;
  const parmas = req.query;
  const isDeleted = parmas.isDeleted ?? false;
  const isActive = parmas.isActive ?? true;
  try {
    settingsSchema.findOne(
      { name: setting, isActive: isActive, isDeleted: isDeleted },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ------------------------- DELETE SETTING BY NAME ------------------------- */
router.delete("/:setting", (req, res) => {
  const parmas = req.query;
  const perminentDelete = parmas.perminentDelete ?? false;

  const setting = req.params.setting;
  try {
    if (!perminentDelete) {
      settingsSchema.findOneAndUpdate(
        { name: setting },
        { $set: { isDeleted: true } },
        { new: true },
        (err, data) => {
          return processRequest(err, data, res, req);
        }
      );
    } else {
      settingsSchema.findOneAndDelete({ name: setting }, (err, data) => {
        return processRequest(err, data, res, req);
      });
    }
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

module.exports = router;
