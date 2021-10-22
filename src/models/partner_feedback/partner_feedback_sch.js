const {
  nonReqStr,
  reqNum,
  reqStr,
  timeStamp,
  modifiedAt,
} = require("../../helpers/schema/schemaHelp");
const mongoose = require("mongoose");
const partnerFeedback = new mongoose.Schema({
  // feedbackId: {
  //   type: String,
  //   unique: true,
  //   required: true,
  //   immutable: true,
  // },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  images: {
    type: [String],
    required: false,
  },
  description: nonReqStr,
  pId: reqStr,
  uId: reqStr,
  ordId: reqStr,
  pDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "partners",
  },
  uDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "users",
  },
  orderDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "orders",
  },
  createdAt: timeStamp,
  lastModified: modifiedAt,
  otherInformation: nonReqStr,
  questionAndAnswers:nonReqStr,
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model("partnerFeedBack", partnerFeedback);
