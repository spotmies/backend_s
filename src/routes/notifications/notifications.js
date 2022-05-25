const express = require("express");
const firebaseFcm = require("../firebase_admin/firebase_admin");
const notificationDB = require("../../models/notifications/notifications");
const router = express.Router();
const {
  processRequest,
  tryCatch,
  deleteRequest,
} = require("../../helpers/error_handling/process_request");

router.post("/notificationByToken", function (req, res) {
  const body = req.body;
  let tokens = [];
  if (Array.isArray(body.token)) {
    tokens = body.token;
  } else {
    tokens.push(body.token);
  }
  tokens.forEach((token) => {
    firebaseFcm.notificationByToken({
      token: token,
      title: body.title,
      body: body.body,
    });
  });
  res.status(200).send("notificationByToken send successfully");
});

router.post("/notificationByTopic", function (req, res) {
  const body = req.body;
  firebaseFcm.notificationByTopic({
    topic: body.topic,
    title: body.title,
    body: body.body,
  });
  res.status(200).send("notificationByTopic send successfully");
});

/* --------------------------- USER NOTIFICATIONS --------------------------- */

router.get("/user/:id", function (req, res) {
  const isDeleted = req?.query?.isDeleted ?? false;
  tryCatch(res, res, () => {
    notificationDB
      .find({ user: req.params.id, isDeleted: isDeleted })
      .sort({ createdAt: -1 })
      .exec(function (err, data) {
        return processRequest(err, data, res, req);
      });
  });
});

/* -------------------------- PARTNER NOTIFICATIONS ------------------------- */

router.get("/partner/:id", function (req, res) {
  const isDeleted = req?.query?.isDeleted ?? false;
  tryCatch(res, res, () => {
    notificationDB
      .find({ partner: req.params.id, isDeleted: isDeleted })
      .sort({ createdAt: -1 })
      .exec(function (err, data) {
        return processRequest(err, data, res, req);
      });
  });
});

/* ------------------------ UDPATE NOTIFICATION BY ID ----------------------- */
router.put("/update/:id", function (req, res) {
  const body = req.body;
  tryCatch(res, res, () => {
    notificationDB.findByIdAndUpdate(
      req.params.id,
      {
        $set: body,
      },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  });
});

/* ------------------------ DELETE NOTIFICATION BY ID ----------------------- */
router.delete("/delete/:id", function (req, res) {
  tryCatch(res, res, () => {
    notificationDB.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isDeleted: true },
      },
      { new: true },
      (err, data) => {
        return deleteRequest(err, data, res, req);
      }
    );
  });
});

module.exports = router;
