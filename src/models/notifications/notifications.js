const mongoose = require("mongoose");
const {
  reqStr,
  createdAt,
  nonReqStr,
  nonReqBool,
  refNonReqUser,
  refNonReqPartner,
} = require("../../helpers/schema/schemaHelp");

const notificationSchema = new mongoose.Schema(
  {
    user: refNonReqUser,
    partner: refNonReqPartner,
    title: reqStr,
    body: reqStr,
    time: createdAt,
    image: nonReqStr,
    type: [nonReqStr],
    isRead: nonReqBool,
    navigation: [nonReqStr],
    data: {
      type: Object,
      default: {},
      required: false,
    },

    /* ------------------------------ Common Fields ----------------------------- */
    createdAt: createdAt,
    isDeleted: nonReqBool,
  },
  { timestamps: true }
);

module.exports = mongoose.model("notifications", notificationSchema);
