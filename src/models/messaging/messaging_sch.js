const mongoose = require("mongoose");
const {
  reqNum,
  unChangeUniqueStr,
  timeStamp,
  unChangeStr,
  upStatesAndCounts
} = require("../../helpers/schema/schemaHelp");

const messaging = {
  msgId: unChangeUniqueStr,
  msgs: { type: [String], validate: (v) => Array.isArray(v) && v.length > 0 },
  cBuild: upStatesAndCounts,
  join: timeStamp,
  ordId: unChangeStr,
  pId: unChangeStr,
  uId: unChangeStr,
  pState: upStatesAndCounts,
  uState: upStatesAndCounts,
  uCount: upStatesAndCounts,
  pCount: upStatesAndCounts,
  lastModified: { type: Number, default: new Date().valueOf() },
  orderDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
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
  isDeletedForUser: {
    required: false,
    type: Boolean,
    default: false,
  },
    isDeletedForPartner: {
    required: false,
    type: Boolean,
    default: false,
  },
};

module.exports = mongoose.model("messaging", messaging);
