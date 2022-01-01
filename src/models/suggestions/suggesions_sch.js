const mongoose = require("mongoose");
const {
  reqStr,
  nonReqStr,
  nonReqBool,
  createdAt,
  modifiedAt,
  nonReqNum,
} = require("../../helpers/schema/schemaHelp");

const suggestionSchema = new mongoose.Schema(
  {
    subject: reqStr,
    body: nonReqStr,
    suggestionFor: {
      type: String,
      enum: ["feedback", "contactUs", "faq", "other"],
      required: true,
    },
    /* ------------------------- contact us form fields ------------------------- */
    name: nonReqStr,
    mobile: nonReqNum,
    email: nonReqStr,
    /* ----------------------------------- xxx ---------------------------------- */
    suggestionFrom: {
      type: String,
      require: true,
      enum: [
        "userApp",
        "userWeb",
        "partnerApp",
        "adminPanel",
        "controlPanel",
        "others",
      ],
    },
    media: [
      {
        mediaType: reqStr,
        mediaUrl: reqStr,
      },
    ],
    uId: nonReqStr,
    pId: nonReqStr,
    uDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      require: false,
    },
    pDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "partner",
      require: false,
    },
    isRead: nonReqBool,
    isStarred: nonReqBool,
    isIssueSolved: nonReqBool,
    feedbackQuestionsId: nonReqStr,
    isFeedbackQuestionsAttempted: nonReqBool,
    attemptedQuestions: [nonReqStr],
    answers: [nonReqStr],
    others: nonReqStr,
    isDeleted: nonReqBool,
    createdAt: createdAt,
    lastModifiedAt: modifiedAt,
  },
  { timestamps: true }
);

module.exports = mongoose.model("suggestions", suggestionSchema);
