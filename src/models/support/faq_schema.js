const mongoose = require("mongoose");
const {
  reqStr,
  nonReqStr,
  defaultNum,
  createdAt,
  modifiedAt,
  nonReqBool,
} = require("../../helpers/schema/schemaHelp");

const faqBody = new mongoose.Schema(
  {
    question: reqStr,
    answer: reqStr,
    sort: defaultNum,
    createdAt: createdAt,
    lastModified: modifiedAt,
    isActive: nonReqBool,

    media: [
      {
        mediaType: reqStr,
        mediaUrl: reqStr,
      },
    ],
  },
  { timestamps: true }
);

const faqSchema = new mongoose.Schema(
  {
    title: reqStr,
    description: nonReqStr,
    sort: defaultNum,
    isActive: nonReqBool,
    body: [faqBody],
    platform: {
      type: String,
      enum: ["userApp", "partnerApp", "UserWeb", "adminPanel", "controlPanel"],
      default: "partnerApp",
    },

    createdAt: createdAt,
    lastModified: modifiedAt,
    isDeleted: nonReqBool,
  },
  { timestamps: true }
);
module.exports = mongoose.model("faqs", faqSchema);
