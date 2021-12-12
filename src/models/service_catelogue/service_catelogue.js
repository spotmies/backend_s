const mongoose = require("mongoose");
const {
  reqStr,
  nonReqNum,
  timeStamp,
  nonReqStr,
  modifiedAt,
  reqNum,
} = require("../../helpers/schema/schemaHelp");
const serivcecatelog = new mongoose.Schema(
  {
    name: reqStr,
    media: [String],
    hide: {
      type: Boolean,
      default: false,
    },
    qty: nonReqNum,
    price: nonReqNum,
    description: nonReqStr,
    inStock: {
      type: Boolean,
      default: true,
    },
    createdAt: timeStamp,
    itemCode: reqNum,
    lastModified: modifiedAt,
    pId: reqStr,
    views: {
      type: Number,
      default: 0,
    },
    category: reqNum,
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("catelogs", serivcecatelog);
