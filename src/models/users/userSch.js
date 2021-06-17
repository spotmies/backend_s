const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  uniqueNum,
  reqUniqueStr,
  uIdSch,
  phoneNum,
  altNum,
  nonReqEmail,
  nonReqUniqueStr,
  timeStamp,
  nonReqTimeStamp,
} = require("../../helpers/schema/schemaHelp");

const userSchema = {
  name: reqStr,
  phNum: phoneNum,
  join: timeStamp,
  pic: nonReqStr,
  eMail: nonReqUniqueStr,
  altNum: altNum,
  uId: uIdSch,
  userState: {
    type: String,
    required: true,
    enum: ["active", "inActive", "blocked"],
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
  lastLogin: nonReqNum,
  logs: [String],
};

module.exports = mongoose.model("users", userSchema);
