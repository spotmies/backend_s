const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  unChangeUniqueStr,
  unChangeStr,
} = require("../../helpers/schema/schemaHelp");

const newOrderSchema = {
  problem: reqStr,
  job: reqNum,
  desc: nonReqStr,
  money: nonReqNum,
  ordId: unChangeUniqueStr,
  ordState: reqNum,
  join: unChangeUniqueStr,
  schedule: reqNum,
  uId: unChangeStr,
  views: nonReqNum,
  loc: {
    type: [Number],
    required: true,
    validate: (v) => Array.isArray(v) && v.length > 1,
  },
  media: [String],
  fBack: nonReqNum,
  pId: nonReqStr,
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "messaging" }],
  responses: [{ type: mongoose.Schema.Types.ObjectId, ref: "responses" }],
};

module.exports = mongoose.model("orders", newOrderSchema);
