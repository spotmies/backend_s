const mongoose = require("mongoose");
const { reqNum, reqStr } = require("../../helpers/schema/schemaHelp");

const postsch = {
  title: reqStr,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "loggers" },
};
module.exports = mongoose.model("posts", postsch);
