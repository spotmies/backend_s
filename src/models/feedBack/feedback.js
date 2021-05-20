const mongoose = require("mongoose");

const feedback = new mongoose.Schema({
  docId: {
    type: String,
    required: false,
  },
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
