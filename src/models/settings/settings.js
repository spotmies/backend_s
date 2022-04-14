const mongoose = require("mongoose");
const {
  createdAt,
  modifiedAt,
  nonReqBool,
  reqStr,
} = require("../../helpers/schema/schemaHelp");

const settingsSch = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        "string",
        "number",
        "boolean",
        "stringify",
        "array",
        "object",
        "bigInt",
        "date",
        "undefined",
        "null",
        "symbol",
      ],
    },
    createdAt: createdAt,
    lastModified: modifiedAt,
    isActive: { type: Boolean, default: true },
    isDeleted: nonReqBool,
    label: reqStr,
  },
  { timestamps: true }
);

module.exports = mongoose.model("settings", settingsSch);
