const express = require("express");
const constants = require("../helpers/constants");
const jwt = require("jsonwebtoken");
const router = express.Router();
// const feedB = require("./feedBack/feedBack");
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
const feedbackQuestionsRouter = require("../routes/suggestions/feedback_questions");
const public = require("./public/public");

/* -------------------------------------------------------------------------- */
/*                                MAIN ROUTERS                                */
/* -------------------------------------------------------------------------- */

// router.use("/feed", feedB);
router.use("/partner-feedback", verifyToken, partnerFeedbackRoute);
router.use("/user", verifyToken, userR);
router.use("/order", verifyToken, orderR);
router.use("/partner", verifyToken, partnerR);
router.use(`/${constants.mainChatRoute}`, verifyToken, chatR);
router.use(`/${constants.mainRouteResponse}`, verifyToken, responsesR);
router.use("/notification", notificationR);
router.use("/catelog", verifyToken, catelogR);
router.use("/career/intern", internsRoute);
router.use("/tutorial/unit", verifyToken, tutorialUnitRouter);
router.use("/tutorial/course", verifyToken, tutorialCoursesRouter);
router.use("/constant", constantsR);
router.use("/services", serviceListRoute);
router.use("/admin", adminRouter);
router.use("/suggestion", suggestionRouter);
router.use("/support/faq", faqRouter);
router.use("/suggestion/feedback-question", feedbackQuestionsRouter);
router.use("/public", public);
router.get("/stamp", (req, res) => {
  let stamp = new Date().valueOf();
  res.send(stamp.toString());
});
router.use("/geocode", verifyToken, geocodeLocator);

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    jwt.verify(req.token, "secretkey", (err, authData) => {
      if (err) {
        return res.sendStatus(403);
      } else {
        next();
      }
    });
  } else {
    // Forbidden
    return res.sendStatus(403);
  }
}

module.exports = router;
