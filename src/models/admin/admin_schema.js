//import mongoose
const Mongoose = require("mongoose");
const {
  reqStr,
  reqEmail,
  phoneNum,
  nonReqBool,
  createdAt,
  modifiedAt,
  nonReqStr,
  arrOfNum,
  defaultString,
  nonReqNum,
  arrSch,
  uIdSch,
} = require("../../helpers/schema/schemaHelp");

const adminSchema = new Mongoose.Schema({
  // create admins schema for mongoose
  adminId: uIdSch,
  name: reqStr,
  email: reqEmail,
  isEmailVerified: nonReqBool,
  phone: phoneNum,
  role: {
    type: String,
    default: "null",
    enum: ["admin", "maintainer", "user", "read", "write", "null"],
    required: false,
  },
  accessToken: defaultString,
  pic: nonReqStr,
  location: arrOfNum,
  address: nonReqStr,
  lastLogin: nonReqNum,
  logs: arrOfNum,
  deviceToken: nonReqStr,
  accessTo: arrSch,
  password: {
    type: String,
    required: false,
    trim: true,
    minlength: 8,
    maxlength: 32,
  },

  createdAt: createdAt,
  lastModified: modifiedAt,
  isDeleted: nonReqBool,
});

module.exports = Mongoose.model("Admins", adminSchema);
