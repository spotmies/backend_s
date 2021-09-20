const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  uniqueNum,
  nonReqUniqueStr,
  dobSch,
  timeStamp,
  bool,
  uIdSch,
  nonReqTimeStamp,
} = require("../../helpers/schema/schemaHelp");

const partnerRegistration = {
  name: reqStr,
  dob: dobSch,
  perAdd: nonReqStr,
  tempAdd: nonReqStr,
  eMail: nonReqUniqueStr,
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
  inComingOrders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
  orders: [
    { type: mongoose.Schema.Types.ObjectId, ref: "orders", unique: true },
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
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
      reportedAt: reqNum,
    },
  ],
  complaints: [
    { type: mongoose.Schema.Types.ObjectId, ref: "partnerComplaints" },
  ],
  isTermsAccepted: { type: Boolean, required: true },
};
module.exports = mongoose.model("partners", partnerRegistration);
