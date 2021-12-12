const mongoose = require("mongoose");
const {
  reqStr,
  nonReqStr,
  nonReqNum,
  modifiedAt,
  uIdSch,
  phoneNum,
  altNum,
  isVerifedSch,

  timeStamp,
  nonReqBool,
  createdAt,
} = require("../../helpers/schema/schemaHelp");

const userSchema = {
  name: reqStr,
  phNum: phoneNum,
  join: timeStamp,
  pic: nonReqStr,
  eMail: { type: String, trim: true },
  isEmailVerified: isVerifedSch,
  isAltNumVerified: isVerifedSch,
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
  referalCode: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    sparse: true,
  },
  location: {
    type: [Number],
  },
  address: nonReqStr,
  userDeviceToken: nonReqStr,
  appConfig:nonReqBool,
  isActive:nonReqBool,
  // common fields
  isDeleted:nonReqBool,
  createdAt:createdAt,
  lastModified: modifiedAt,

};

module.exports = mongoose.model("users", userSchema);
