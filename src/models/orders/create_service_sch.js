const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  uniqueNum,
  reqUniqueStr,
  nonReqUniqueStr,
  unChangeUniqueNum,
  unChangeStr,
} = require("../../helpers/schema/schemaHelp");

const newOrderSchema = {
  problem: reqStr,
  job: reqNum,
  desc: nonReqStr,
  money: nonReqNum,
  ordId: unChangeUniqueNum,
  ordState: reqNum,
  join: unChangeUniqueNum,
  schedule: reqNum,
  uId: unChangeStr,
  views: nonReqNum,
  loc: { type: [Number], validate: (v) => Array.isArray(v) && v.length > 1 },
  media: [String],
  fBack: nonReqNum,
  pId: nonReqStr,
  msgId: [nonReqStr],
};

module.exports = mongoose.model("orders", newOrderSchema);
