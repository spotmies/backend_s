const mongoose = require("mongoose");
const {
  reqNum,
  unChangeStr,
  timeStamp,
  ordIdSch,
  unChangeNum,
} = require("../../helpers/schema/schemaHelp");

const newReponseSch = {
  responseId: ordIdSch,
  ordId: unChangeNum,
  uId: unChangeStr,
  pId: unChangeStr,
  money: reqNum,
  schedule: timeStamp,
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
  pDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: "partners",
  },
  uDetails: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    immutable: true,
    ref: "users",
  },
  join: timeStamp,

  //add join attribute hehre
};
module.exports = mongoose.model("responses", newReponseSch);
