const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  unChangeUniqueStr,
  timeStamp,
  unChangeStr,
  ordIdSch,
  nonReqTimeStamp,
} = require("../../helpers/schema/schemaHelp");

const newOrderSchema = {
  problem: reqStr,
  job: reqNum,
  desc: nonReqStr,
  money: nonReqNum,
  ordId: ordIdSch,
  ordState: {
    type: String,
    required: true,
    enum: ["req", "noPartner", "updated", "onGoing", "completed", "cancel"],
  },
  join: timeStamp,
  schedule: timeStamp,
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
  uDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: "users",
  },
  //below field is used to check whether doc deleted or not
  isDeleted: {
    required: false,
    type: Boolean,
    default: false,
  },
  //this below field used for accept or cancel order
  acceptBy: nonReqStr,
  cancelBy: nonReqStr,
  acceptAt: nonReqTimeStamp,
  cancelAt: nonReqTimeStamp,
};

module.exports = mongoose.model("orders", newOrderSchema);
