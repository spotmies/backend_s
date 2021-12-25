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
      enum: ["feedback", "contactUs"],
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
    questions: [
      {
        type: String,
        require: false,
      },
    ],
    answers: [
      {
        type: String,
        require: false,
      },
    ],
    others: nonReqStr,
    isDeleted: nonReqBool,
    createdAt: createdAt,
    lastModifiedAt: modifiedAt,
  },
  { timestamps: true }
);

module.exports = mongoose.model("suggestions", suggestionSchema);
