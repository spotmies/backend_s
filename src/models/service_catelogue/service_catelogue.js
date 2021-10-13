const mongoose = require("mongoose");
const {
  reqStr,
  nonReqNum,
  timeStamp,
  nonReqStr,
  modifiedAt,
  reqNum
} = require("../../helpers/schema/schemaHelp");
const serivceCatelogue = {
  name: reqStr,
  media: [String],
  hide: {
    type: Boolean,
    default: true,
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
  modifiedAt: modifiedAt,
  pId:reqStr,
  views:{
      type:Number,
      default:0
  },
  category:reqNum,

};

module.exports = mongoose.model("catelogue", serivceCatelogue);