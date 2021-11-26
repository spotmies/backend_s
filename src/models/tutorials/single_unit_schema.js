const mongoose = require("mongoose");
const {
  reqStr,
  nonReqStr,
  uIdSch,
  reqNum,
  createdAt,
  modifiedAt,
  nonReqBool,
} = require("../../helpers/schema/schemaHelp");

var topicSchema = new mongoose.Schema({
  topicName: reqStr,
  sort:reqNum,
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
  sort:reqNum,
  unitId: uIdSch,
  unitName: reqStr,
  topics: [topicSchema],
  createdAt:createdAt,
  lastModified:modifiedAt,
  isDeleted:nonReqBool
},  { timestamps: true }
);
module.exports = mongoose.model("tutorial_units", unitSchema);
