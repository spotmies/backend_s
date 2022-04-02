const express = require("express");
const firebaseFcm = require("../firebase_admin/firebase_admin");
const router = express.Router();

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
module.exports = router;
