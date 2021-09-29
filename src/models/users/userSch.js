const mongoose = require("mongoose");
const {
  reqStr,
  nonReqStr,
  nonReqNum,

  uIdSch,
  phoneNum,
  altNum,

  timeStamp,
} = require("../../helpers/schema/schemaHelp");

const userSchema = {
  name: reqStr,
  phNum: phoneNum,
  join: timeStamp,
  pic: nonReqStr,
  eMail: { type: String, trim: true, index: true, unique: true, sparse: true },
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
  referalCode:{ type: String, trim: true, index: true, unique: true, sparse: true },
    location: {
    type: [Number],
  },
  address: nonReqStr,
  userDeviceToken:nonReqStr

};

module.exports = mongoose.model("users", userSchema);
