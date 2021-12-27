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
const tutorialCoursesRouter = require("./tutorials/courses");
const constantsR = require("./constants/constants");
const serviceListRoute = require("../routes/services_list/services_list");
const adminRouter = require("../routes/admin/admin");
const suggestionRouter = require("../routes/suggestions/suggestions");
const faqRouter = require("../routes/support/faq");
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
router.use("/tutorial/unit", tutorialUnitRouter);
router.use("/tutorial/course", tutorialCoursesRouter);
router.use("/constant", constantsR);
router.use("/services", serviceListRoute);
router.use("/admin", adminRouter);
router.use("/suggestion",suggestionRouter);
router.use("/support/faq", faqRouter);
router.get("/stamp", (req, res) => {
  let stamp = new Date().valueOf();
  res.send(stamp.toString());
});
router.use("/geocode", geocodeLocator);

// router.use("/logger", loggerR);
// router.use("/post", postR);

module.exports = router;
