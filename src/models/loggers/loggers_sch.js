const mongoose = require("mongoose");
const { reqNum, reqStr } = require("../../helpers/schema/schemaHelp");

const loggersch = {
  name: reqStr,
  num: reqNum,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
};
module.exports = mongoose.model("loggers", loggersch);
