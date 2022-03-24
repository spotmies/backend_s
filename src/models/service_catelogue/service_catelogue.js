const mongoose = require("mongoose");
const {
  reqStr,
  nonReqNum,
  nonReqStr,
  modifiedAt,
  reqNum,
  nonReqBool,
  createdAt,
} = require("../../helpers/schema/schemaHelp");
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
    isDeleted: nonReqBool,
    createdAt: createdAt,
    lastModified: modifiedAt,
  },
  { timestamps: true }
);

module.exports = mongoose.model("catelogs", serivcecatelog);
