const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  uniqueNum,
  reqUniqueStr,
  uIdSch,
  nonReqUniqueStr,
} = require("../../helpers/schema/schemaHelp");

const userSchema = {
  name: reqStr,
  phNum: uniqueNum,
  join: reqNum,
  pic: nonReqStr,
  eMail: nonReqUniqueStr,
  altNum: nonReqNum,
  uId: uIdSch,
  userState: reqStr,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
  lastLogin: nonReqNum,
  logs: [String],
};

module.exports = mongoose.model("users", userSchema);
