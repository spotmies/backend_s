const mongoose = require("mongoose");
const {
  reqNum,
  reqStr,
  nonReqStr,
  nonReqNum,
  uniqueNum,
  isVerifedSch,
  dobSch,
  timeStamp,
  bool,
  uIdSch,
  nonReqTimeStamp,
  createdAt,
  modifiedAt,
  nonReqBool,
  reqBool,
  viewsSchema,
  nonReqUniqueStr,
} = require("../../helpers/schema/schemaHelp");

const partnerRegistration = new mongoose.Schema(
  {
    name: reqStr,
    dob: dobSch,
    perAdd: nonReqStr,
    tempAdd: nonReqStr,
    eMail: nonReqStr,
    isEmailVerified: isVerifedSch,
    isAltNumVerifed: isVerifedSch,
    isLocationVerified: isVerifedSch,
    phNum: uniqueNum,
    altNum: nonReqNum,
    job: reqNum,
    pId: uIdSch,
    join: timeStamp,
    accountType: reqStr,
    lang: [String],
    businessName: nonReqStr,
    collegeName: nonReqStr,
    experience: nonReqNum,
    minServicePrice: nonReqNum,
    maxServicePrice: nonReqNum,
    media: [
      {
        mediaType: reqStr,
        mediaUrl: reqStr,
      },
    ],
    ref: [String],
    inComingOrders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "orders", required: false },
    ],
    orders: [
      { type: mongoose.Schema.Types.ObjectId, ref: "orders", required: false },
    ],
    rate: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "partner_feedbacks",
        required: false,
      },
    ],
    acceptance: [nonReqNum],
    availability: bool,
    partnerPic: nonReqStr,
    docs: {
      adharF: {
        type: String,
      },
      adharB: {
        type: String,
      },
      otherDocs: [String],
    },

    lastLogin: nonReqTimeStamp,
    logs: [String],
    permission: reqNum,
    feedBack: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "partner_feedbacks",
        required: false,
      },
    ],
    reports: [
      {
        reportedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
          required: false,
        },
        reportedAt: reqNum,
      },
    ],
    complaints: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "partnerComplaints",
        required: false,
      },
    ],
    catelogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "catelogs",
        required: false,
      },
    ],
    isTermsAccepted: reqBool,
    partnerDeviceToken: nonReqStr,
    workLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
    },
    homeLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
    },
    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
    },
    workAddress: nonReqStr,
    homeAddress: nonReqStr,
    currentAddress: nonReqStr,
    isDocumentsVerified: nonReqBool,
    enableModifications: nonReqBool,
    appConfig: nonReqBool,
    isActive: nonReqBool,
    partnerState: {
      type: String,
      required: false,
      enum: ["active", "inActive", "blocked", "banned", "suspended"],
      default: "active",
    },
    businessLogo: nonReqStr,
    businessBanner: nonReqStr,
    businessDescription: nonReqStr,
    businessType: nonReqStr,
    isDoorStepDeliveryAvailable: nonReqBool,
    isAcceptOnlinePayment: nonReqBool,
    landMark: nonReqStr,
    websites: [nonReqStr],
    views: [viewsSchema],
    storeId: nonReqUniqueStr,

    //common fields
    createdAt: createdAt,
    lastModified: modifiedAt,
    isDeleted: nonReqBool,
  },
  { timestamps: true }
);
partnerRegistration.index({
  workLocation: "2dsphere",
});
partnerRegistration.index({
  homeLocation: "2dsphere",
});
partnerRegistration.index({
  currentLocation: "2dsphere",
});

module.exports = mongoose.model("partners", partnerRegistration);
