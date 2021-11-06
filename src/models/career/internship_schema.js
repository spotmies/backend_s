const mongoose = require("mongoose");
const {
  nonReqNum,
  reqNum,
  defaultString,
  timeStamp,
  modifiedAt,
  reqStr,
} = require("../../helpers/schema/schemaHelp");

const internshipSchema = new mongoose.Schema({
  name: reqStr,
  phone: reqNum,
  email: {
    type: String,
    required: true,
    trim: true,
  },
  programmingLanguage: {
    type: [String],
    required: true,
  },
  previousExperience: {
    type: [String],
    required: true,
  },
  isGraduate: {
    type: Boolean,
    required: false,
    default: false,
  },
  yearOfStuding: {
    type: Number,
    required: false,
    default: 0,
  },
  courseType: defaultString,
  branchName: defaultString,
  resume: defaultString,
  address: defaultString,
  college: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: defaultString,
  startDate: nonReqNum,
  endDate: nonReqNum,
  location: {
    type: [Number],
    required: false,
  },
  status: defaultString,
  createdAt: timeStamp,
  modifiedAt: modifiedAt,
  createdFrom: defaultString,
  modifiedFrom: defaultString,
  otherInfo: defaultString,
  appliedFor: reqStr,
  isDeleted: {
    type: Boolean,
    required: false,
    default: false,
  },
});

module.exports = mongoose.model("interns", internshipSchema);
