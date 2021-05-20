const { nonReqStr } = require("../../helpers/schema/schemaHelp");
const mongoose = require("mongoose");

const feedback = new mongoose.Schema({
  docId: nonReqStr,
  body: {
    type: [String],
    require: true,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("feedBack", feedback);
