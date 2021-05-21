const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  uniqueNum,
  reqUniqueStr,
  nonReqUniqueStr,
} = require("../../helpers/schema/schemaHelp");

const userSchema = {
  name: reqStr,
  phNum: reqNum,
  //  uniqueNum,
  join: reqNum,
  pic: nonReqStr,
  eMail: nonReqStr,
  // nonReqUniqueStr
  altNum: nonReqNum,
  uId: reqUniqueStr,
  userState: reqStr,
  orders: [String],
  quotes: [String],
  lastLogin: nonReqNum,
  logs: [String],
};

module.exports = mongoose.model("users", userSchema);
