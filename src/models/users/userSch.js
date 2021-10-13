const mongoose = require("mongoose");
const {
  reqStr,
  nonReqStr,
  nonReqNum,
  modifiedAt,
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
  lastModified: modifiedAt,
  eMail: { type: String, trim: true },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isAltNumVerified: {
    type: Boolean,
    default: false,
  },
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
};

module.exports = mongoose.model("users", userSchema);
