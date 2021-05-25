const mongoose = require("mongoose");
const {
  reqNum,
  unChangeUniqueStr,
  unChangeStr,
} = require("../../helpers/schema/schemaHelp");

const messaging = {
  msgId: unChangeUniqueStr,
  msgs: { type: [String], validate: (v) => Array.isArray(v) && v.length > 0 },
  cBuild: reqNum,
  join: unChangeUniqueStr,
  ordId: unChangeStr,
  pId: unChangeStr,
  uId: unChangeStr,
  pState: reqNum,
  uState: reqNum,
  uCount: reqNum,
  pCount: reqNum,
};

module.exports = mongoose.model("messaging", messaging);
