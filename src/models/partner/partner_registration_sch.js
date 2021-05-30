const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  uniqueNum,
  nonReqUniqueStr,
  unChangeUniqueStr,
  dobSch,
  bool,
  uIdSch,
  unChangeStr,
} = require("../../helpers/schema/schemaHelp");

const partnerRegistration = {
  name: reqStr,
  dob: dobSch,
  perAdd: nonReqStr,
  tempAdd: nonReqStr,
  eMail: nonReqUniqueStr,
  phNum: uniqueNum,
  atlNum: nonReqNum,
  job: reqNum,
  pId: uIdSch,
  join: unChangeUniqueStr,
  accountType: reqStr,
  lang: [String],
  businessName: nonReqStr,
  experience: nonReqNum,
  ref: [String],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
  rate: [nonReqNum],
  acceptance: nonReqNum,
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

  lastLogin: nonReqUniqueStr,
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
};
module.exports = mongoose.model("partners", partnerRegistration);
