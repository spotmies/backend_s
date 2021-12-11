const mongoose = require("mongoose");
const {
  reqStr,
  createdAt,
  modifiedAt,
  nonReqBool,
  uIdSch,
  nonReqStr,
  reqNum,
} = require("../../helpers/schema/schemaHelp");

const courseSchema = new mongoose.Schema(
  {
    courseName: reqStr,
    // courseId: uIdSch,
    primaryColor: nonReqStr,
    secondaryColor: nonReqStr,
    courseDescription: nonReqStr,
    courseImages: [
      {
        required: false,
        mediaType: reqStr,
        mediaUrl: reqStr,
      },
    ],
    isActive: nonReqBool,
    listUnits: [
      { type: mongoose.Schema.Types.ObjectId, ref: "tutorial_units" },
    ],
    sort: reqNum,
    createdAt: createdAt,
    lastModified: modifiedAt,
    isDeleted: nonReqBool,
  },
  { timestamps: true }
);

module.exports = mongoose.model("courses", courseSchema);
