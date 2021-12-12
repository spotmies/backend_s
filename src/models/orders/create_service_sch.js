const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  timeStamp,
  unChangeStr,
  ordIdSch,
  orderSchedule,
  nonReqTimeStamp,
} = require("../../helpers/schema/schemaHelp");

const newOrderSchema = new mongoose.Schema(
  {
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
    orderState: {
      type: Number,
      required: false,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      default: 0,
    },
    join: timeStamp,
    schedule: orderSchedule,
    uId: unChangeStr,
    views: nonReqNum,
    loc: {
      type: [Number],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 1,
    },
    address: nonReqStr,

    media: [String],
    fBack: nonReqNum,
    pId: nonReqStr,
    orderSendTo: [nonReqStr],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "messaging" }],
    responses: [{ type: mongoose.Schema.Types.ObjectId, ref: "responses" }],
    uDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
      ref: "users",
    },
    pDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "partners",
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
    //this below field used for accept or cancel order
    acceptBy: nonReqStr,
    cancelBy: nonReqStr,
    acceptAt: nonReqTimeStamp,
    cancelAt: nonReqTimeStamp,
    // acceptMoney: nonReqNum,
    acceptResponse: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "responses",
    },
    revealProfileTo: [String],
    feedBackDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "partnerfeedbacks",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("orders", newOrderSchema);
