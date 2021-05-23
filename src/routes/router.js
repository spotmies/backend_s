const express = require("express");
const router = express.Router();
const feedB = require("./feedBack/feedBack");
const userR = require("./users/userR");
const orderR = require("./orders/creat_service");
const partnerR = require("./partner/partner_registration");

router.use("/feed", feedB);
router.use("/user", userR);
router.use("/order", orderR);
router.use("/partner", partnerR);
router.get("/stamp", (req, res) => {
  let stamp = new Date().valueOf();
  res.send(stamp.toString());
});

module.exports = router;
