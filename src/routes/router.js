const express = require("express");
const constants = require("../helpers/constants");

const router = express.Router();
const feedB = require("./feedBack/feedBack");
const userR = require("./users/userR");
const orderR = require("./orders/creat_service");
const partnerR = require("./partner/partner_registration");
const chatR = require("./messaging/messaging");

/* -------------------------------------------------------------------------- */
/*                                MAIN ROUTERS                                */
/* -------------------------------------------------------------------------- */

router.use("/feed", feedB);
router.use("/user", userR);
router.use("/order", orderR);
router.use("/partner", partnerR);
router.use(`/${constants.mainChatRoute}`, chatR);
router.get("/stamp", (req, res) => {
  let stamp = new Date().valueOf();
  res.send(stamp.toString());
});

module.exports = router;
