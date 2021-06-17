const mongoose = require("mongoose");
const {
  reqNum,
  unChangeStr,
  unChangeUniqueStr,
} = require("../../helpers/schema/schemaHelp");

const newReponseSch = {
  responseId: unChangeUniqueStr,
  ordId: unChangeStr,
  uId: unChangeStr,
  pId: unChangeStr,
  money: reqNum,
  schedule: reqNum,
  loc: {
    type: [Number],
    required: true,
    validate: (v) => Array.isArray(v) && v.length > 1,
  },
  orderDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: "orders",
  },

  //add join attribute hehre
};
module.exports = mongoose.model("responses", newReponseSch);
