const mongoose = require("mongoose");
const { reqNum, reqStr } = require("../../helpers/schema/schemaHelp");

const partnerComplaints = {
  uId: reqStr,
  pId: reqStr,
  join: reqNum,
  complaint: reqStr,
};
module.exports = mongoose.model("partnerComplaints", partnerComplaints);
