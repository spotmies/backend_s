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
const notificationR = require("./notifications/notifications");
const catelogR = require("./service_catelogue/catelogue");
const partnerFeedbackRoute = require("./feedBack/partner_feedback");
const internsRoute = require("./career/interns");
const tutorialUnitRouter = require("./tutorials/single_unit");
// const loggerR = require("./loggers/loggers");
//const postR = require("./posts/post");

/* -------------------------------------------------------------------------- */
/*                                MAIN ROUTERS                                */
/* -------------------------------------------------------------------------- */

router.use("/feed", feedB);
router.use("/partner-feedback", partnerFeedbackRoute);
router.use("/user", userR);
router.use("/order", orderR);
router.use("/partner", partnerR);
router.use(`/${constants.mainChatRoute}`, chatR);
router.use(`/${constants.mainRouteResponse}`, responsesR);
router.use("/notification", notificationR);
router.use("/catelog", catelogR);
router.use("/career/intern", internsRoute);
router.use("/tutorial", tutorialUnitRouter);
router.get("/stamp", (req, res) => {
  let stamp = new Date().valueOf();
  res.send(stamp.toString());
});
router.use("/geocode", geocodeLocator);

// router.use("/logger", loggerR);
// router.use("/post", postR);

module.exports = router;
