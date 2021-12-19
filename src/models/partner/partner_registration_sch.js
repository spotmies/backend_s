const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  uniqueNum,
  isVerifedSch,
  dobSch,
  timeStamp,
  bool,
  uIdSch,
  nonReqTimeStamp,
  createdAt,
  modifiedAt,
  nonReqBool,
} = require("../../helpers/schema/schemaHelp");

const partnerRegistration = new mongoose.Schema({
  name: reqStr,
  dob: dobSch,
  perAdd: nonReqStr,
  tempAdd: nonReqStr,
  eMail: nonReqStr,
  isEmailVerified: isVerifedSch,
  isAltNumVerifed: isVerifedSch,
  phNum: uniqueNum,
  altNum: nonReqNum,
  job: reqNum,
  pId: uIdSch,
  join: timeStamp,
  accountType: reqStr,
  lang: [String],
  businessName: nonReqStr,
  experience: nonReqNum,
  ref: [String],
  inComingOrders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "orders", required: false },
  ],
  orders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "orders", required: false },
  ],
  rate: [nonReqNum],
  acceptance: [nonReqNum],
  availability: bool,
  partnerPic: nonReqStr,
  docs: {
    adharF: {
      type: String,
    },
    adharB: {
      type: String,
    },
    otherDocs: [String],
  },

  lastLogin: nonReqTimeStamp,
  logs: [String],
  permission: reqNum,
  feedBack: [],
  reports: [
    {
      reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: false,
      },
      reportedAt: reqNum,
    },
  ],
  complaints: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "partnerComplaints",
      required: false,
    },
  ],
  catelogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "catelogs",
      required: false,
    },
  ],
  isTermsAccepted: { type: Boolean, required: true },
  partnerDeviceToken: nonReqStr,
  workLocation: {
    required: true,
    type: [Number],
  },
  homeLocation: [Number],
  currentLocation: [Number],
  isDocumentsVerified: nonReqBool,
  enableModifications: nonReqBool,
  appConfig:nonReqBool,
  isActive:nonReqBool,

  //common fields
  createdAt: createdAt,
  lastModified: modifiedAt,
  isDeleted: nonReqBool,
},{timestamps:true});
module.exports = mongoose.model("partners", partnerRegistration);
