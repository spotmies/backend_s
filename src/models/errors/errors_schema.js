const mongoose = require("mongoose");
const {
  nonReqBool,
  createdAt,
  modifiedAt,
  nonReqStr,
} = require("../../helpers/schema/schemaHelp");

const errorSchema = new mongoose.Schema(
  {
    error: nonReqStr,
    errorType: nonReqStr,
    errorBody: nonReqStr,
    api: nonReqStr,
    method: nonReqStr,

    isRead: nonReqBool,
    isStarred: nonReqBool,
    isIssueSolved: nonReqBool,

    isDeleted: nonReqBool,
    createdAt: createdAt,
    lastModified: modifiedAt,
  },
  { timestamps: true }
);

module.exports = mongoose.model("errors", errorSchema);
