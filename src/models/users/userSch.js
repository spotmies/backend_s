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
  refferalCode,
  refNonReqUser,
} = require("../../helpers/schema/schemaHelp");

const userSchema = new mongoose.Schema(
  {
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
      enum: ["active", "inActive", "blocked", "banned", "suspended"],
    },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "orders" }],
    lastLogin: nonReqNum,
    logs: [String],
    refferalCode: refferalCode,
    refferBy: refNonReqUser,
    refferTo: [refNonReqUser],
    isRefferalCredited: nonReqBool,
    location: {
      type: [Number],
    },
    address: nonReqStr,
    userDeviceToken: nonReqStr,
    appConfig: nonReqBool,
    isActive: nonReqBool,
    // common fields
    isDeleted: nonReqBool,
    createdAt: createdAt,
    lastModified: modifiedAt,
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
