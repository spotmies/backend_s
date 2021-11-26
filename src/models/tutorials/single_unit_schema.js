const mongoose = require("mongoose");
const {
  reqStr,
  nonReqStr,
  uIdSch,
} = require("../../helpers/schema/schemaHelp");

var topicSchema = new mongoose.Schema({
  TopicName: reqStr,
  data: {
    media: [
      {
        required: false,
        mediaType: reqStr,
        mediaUrl: reqStr,
      },
    ],
    content: nonReqStr,
    required: false,
  },
});

const unitSchema = new mongoose.Schema({
  unitId: uIdSch,
  required: true,
  unitName: reqStr,
  topics: [topicSchema],
});
module.exports = mongoose.model("tutorial_units", unitSchema);
