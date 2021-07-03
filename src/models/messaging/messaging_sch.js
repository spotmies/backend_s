const mongoose = require("mongoose");
const {
  reqNum,
  unChangeUniqueStr,
  timeStamp,
  unChangeStr,
} = require("../../helpers/schema/schemaHelp");

const messaging = {
  msgId: unChangeUniqueStr,
  msgs: { type: [String], validate: (v) => Array.isArray(v) && v.length > 0 },
  cBuild: reqNum,
  join: timeStamp,
  ordId: unChangeStr,
  pId: unChangeStr,
  uId: unChangeStr,
  pState: reqNum,
  uState: reqNum,
  uCount: reqNum,
  pCount: reqNum,
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
};

module.exports = mongoose.model("messaging", messaging);
