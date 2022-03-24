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
  createdAt,
  modifiedAt,
  nonReqBool,
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
      required: false,
      enum: ["req", "noPartner", "updated", "onGoing", "completed", "cancel"],
      default: "req",
    },
    orderState: {
      type: Number,
      required: false,
      enum: [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20,
      ],
      default: 0,
    },
    join: timeStamp,
    schedule: orderSchedule,
    uId: unChangeStr,
    views: nonReqNum,
    loc: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
    },
    address: nonReqStr,

    media: [String],
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
    isDeletedForUser: nonReqBool,
    isDeletedForPartner: nonReqBool,
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
      ref: "partner_feedbacks",
    },
    isBooking: nonReqBool,
    catelog: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "catelogs",
    },
    moneyGivenByUser: nonReqNum,
    moneyTakenByPartner: nonReqNum,
    isOrderCompletedByUser: nonReqBool,
    isOrderCompletedByPartner: nonReqBool,
    orderCompletedAtUser: nonReqTimeStamp,
    orderCompletedAtPartner: nonReqTimeStamp,
    createdAt: createdAt,
    lastModified: modifiedAt,
  },
  { timestamps: true }
);

newOrderSchema.index({
  loc: "2dsphere",
});

module.exports = mongoose.model("orders", newOrderSchema);
