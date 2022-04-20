const mongoose = require("mongoose");
const {
  reqStr,
  nonReqNum,
  nonReqStr,
  modifiedAt,
  reqNum,
  nonReqBool,
  createdAt,
  arrSch,
  arrOfNum,
  defaultNum,
} = require("../../helpers/schema/schemaHelp");

const polygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Polygon"],
    default: "Polygon",
    required: false,
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: false,
  },
});

const serivcecatelog = new mongoose.Schema(
  {
    name: reqStr,
    media: [
      {
        required: false,
        type: reqStr,
        url: reqStr,
      },
    ],
    isActive: nonReqBool,
    qty: nonReqNum,
    price: nonReqNum,
    description: nonReqStr,

    itemCode: reqNum,

    pId: reqStr,
    pDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "partners",
    },
    views: {
      type: Number,
      default: 0,
    },
    category: reqNum,

    /* ------------------------------- new updated schema ------------------------------- */

    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "partner_feedbacks",
      },
    ],
    bookings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "orders",
      },
    ],
    offerPrice: nonReqNum,
    termsAndConditions: arrSch,
    note: nonReqStr,
    warrantyDays: nonReqNum,
    warrantyDetails: nonReqStr,
    isWarranty: nonReqBool,
    cashOnService: nonReqBool,
    rating: nonReqNum,
    isVerified: nonReqBool,
    daysToComplete: nonReqNum,
    hoursToComplete: nonReqNum,
    whatIncluds: arrSch,
    whatNotIncluds: arrSch,
    faq: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "faqs",
    },
    sorting: defaultNum,
    location: polygonSchema,
    range: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: [Number],
      required: false,
    },

    pinCodeAvailability: arrOfNum,
    isDeleted: nonReqBool,
    createdAt: createdAt,
    lastModified: modifiedAt,
  },
  { timestamps: true }
);

// serivcecatelog.index({
//   range: "2dsphere",
// });

module.exports = mongoose.model("catelogs", serivcecatelog);
