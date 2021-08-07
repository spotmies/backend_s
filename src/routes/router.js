const express = require("express");
const constants = require("../helpers/constants");

const router = express.Router();
const feedB = require("./feedBack/feedBack");
const userR = require("./users/userR");
const orderR = require("./orders/creat_service");
const partnerR = require("./partner/partner_registration");
const chatR = require("./messaging/messaging");
const responsesR = require("./responses/responses");
const geocodeLocator = require("./geocode/geocode");
// const loggerR = require("./loggers/loggers");
// const postR = require("./posts/post");

/* -------------------------------------------------------------------------- */
/*                                MAIN ROUTERS                                */
/* -------------------------------------------------------------------------- */

router.use("/feed", feedB);
router.use("/user", userR);
router.use("/order", orderR);
router.use("/partner", partnerR);
router.use(`/${constants.mainChatRoute}`, chatR);
router.use(`/${constants.mainRouteResponse}`, responsesR);
router.get("/stamp", (req, res) => {
  let stamp = new Date().valueOf();
  res.send(stamp.toString());
});
router.use("/geocode", geocodeLocator);

// router.use("/logger", loggerR);
// router.use("/post", postR);

module.exports = router;
