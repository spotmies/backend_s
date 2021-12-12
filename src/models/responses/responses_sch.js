const mongoose = require("mongoose");
const {
  reqNum,
  unChangeStr,
  timeStamp,
  ordIdSch,
  unChangeNum,
  nonReqNum,
  responseSchedule,
} = require("../../helpers/schema/schemaHelp");

const newReponseSch = new mongoose.Schema(
  {
    responseId: ordIdSch,
    ordId: unChangeNum,
    uId: unChangeStr,
    pId: unChangeStr,
    money: nonReqNum,
    schedule: responseSchedule,
    loc: {
      type: [Number],
      required: false,
      validate: (v) => Array.isArray(v) && v.length > 1,
    },
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
    join: timeStamp,
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
    //this will updated to true when user accepted partner quote
    isAccepted: {
      required: false,
      type: Boolean,
      default: false,
    },
    orderState: {
      type: Number,
      required: false,
      enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      default: 0,
    },

    //add join attribute hehre
  },
  { timestamps: true }
);
module.exports = mongoose.model("responses", newReponseSch);
