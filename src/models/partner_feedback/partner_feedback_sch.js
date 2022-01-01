const {
  nonReqStr,
  reqStr,
  modifiedAt,
  nonReqBool,
  createdAt,
} = require("../../helpers/schema/schemaHelp");
const mongoose = require("mongoose");
const partnerFeedback = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    media: [
      {
        mediaType: reqStr,
        mediaUrl: reqStr,
      },
    ],
    description: nonReqStr,
    pId: reqStr,
    uId: reqStr,
    ordId: reqStr,
    pDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "partners",
    },
    uDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    orderDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "orders",
    },
    feedbackQuestionsId:nonReqStr,
    isFeedbackQuestionsAttempted:nonReqBool,
    createdAt: createdAt,
    lastModified: modifiedAt,
    otherInformation: nonReqStr,
    attemptedQuestions: [nonReqStr],
    answers: [nonReqStr],
    isDeleted: nonReqBool,
  },
  { timestamps: true }
);

module.exports = mongoose.model("partner_feedbacks", partnerFeedback);
