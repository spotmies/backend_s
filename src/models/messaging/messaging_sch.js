const mongoose = require("mongoose");
const {
  unChangeUniqueStr,
  unChangeStr,
  upStatesAndCounts,
  nonReqBool,
  createdAt,
  nonReqStr,
  modifiedAt,
} = require("../../helpers/schema/schemaHelp");

const messaging = new mongoose.Schema(
  {
    msgId: unChangeUniqueStr,
    msgs: { type: [String], validate: (v) => Array.isArray(v) && v.length > 0 },
    cBuild: upStatesAndCounts,
    join: createdAt,
    ordId: nonReqStr,
    pId: unChangeStr,
    uId: unChangeStr,
    pState: upStatesAndCounts,
    uState: upStatesAndCounts,
    uCount: upStatesAndCounts,
    pCount: upStatesAndCounts,
    lastModified: modifiedAt,
    isNormalChat: nonReqBool,
    orderDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      immutable: true,
      ref: "orders",
    },
    pDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
      ref: "partners",
    },
    uDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
      ref: "users",
    },
    //below field is used to check whether doc deleted or not
    isDeletedForUser: nonReqBool,
    isDeletedForPartner: nonReqBool,
  },
  { timestamps: true }
);

module.exports = mongoose.model("messaging", messaging);
