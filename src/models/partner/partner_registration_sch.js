const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  uniqueNum,
  reqUniqueStr,
  nonReqUniqueStr,
  unChangeUniqueStr,
  unChangeStr,
  arrSch,
  dobSch,
  bool,
  uIdSch,
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
  //   lang: {
  //     type: [String],
  //     required: true,
  //     validate: (v) => Array.isArray(v) && v.length > 0,
  //   },
  lang: [String],
  businessName: nonReqStr,
  experience: nonReqNum,
  ref: [String],
  order: [String],
  rate: nonReqNum,
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
};
module.exports = mongoose.model("partners", partnerRegistration);
