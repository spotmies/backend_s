const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  timeStamp,
} = require("../../helpers/schema/schemaHelp");

const partnerComplaints = {
  uId: reqStr,
  pId: reqStr,
  join: timeStamp,
  complaint: reqStr,
};
module.exports = mongoose.model("partnerComplaints", partnerComplaints);
