const mongoose = require("mongoose");
const {
  createdAt,
  modifiedAt,
  nonReqBool,
  reqStr,
  nonReqStr,
} = require("../../helpers/schema/schemaHelp");

const feedbackQuestionsSchema = new mongoose.Schema({
  questions:[
      {
        question:reqStr,
        questionType:reqStr,
        isActive:nonReqBool,
        options:[nonReqStr],
      }
  ],
  isActive:nonReqBool,
  createdAt: createdAt,
  lastModified: modifiedAt,
  isDeleted: nonReqBool,
});

module.exports = mongoose.model("feedback_questions", feedbackQuestionsSchema);
