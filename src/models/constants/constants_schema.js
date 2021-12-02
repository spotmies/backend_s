const Mongoose = require("mongoose");

const {
  nonReqStr,
  nonReqBool,
  defaultString,
  settingId,
  createdAt,
  modifiedAt,
  constantsId,
} = require("../../helpers/schema/schemaHelp");

const idSchema = new Mongoose.Schema({
  objId: settingId,
  type: nonReqStr,
  label: defaultString,
  value: nonReqStr,
  color: defaultString,
  more: nonReqStr,
});

const textFieldSchema = new Mongoose.Schema({
  objId: settingId,
  type: nonReqStr,
  hint: defaultString,
  label: defaultString,
  autoFillText: defaultString,
  helperText: defaultString,
  errorText: defaultString,
  backgroundColor: defaultString,
  errorColor: defaultString,
  activeColor: defaultString,
  inActiveColor: defaultString,
  borderColor: defaultString,
  placeHolder: defaultString,
});

const buttonSchema = new Mongoose.Schema({
  objId: settingId,
  type: nonReqStr,
  buttonColor: defaultString,
  text: defaultString,
  textColor: defaultString,
  more: nonReqStr,
});

const constantsSchema = new Mongoose.Schema(
  {
    constantsId: constantsId,
    onBoard: [idSchema],
    login: [idSchema],
    welcome: [idSchema],
    signup: [idSchema],
    otp: [idSchema],
    logos: [idSchema],
    sideMenu: [idSchema],
    buttons: [buttonSchema],
    textFields: [textFieldSchema],
    home: [idSchema],
    orders: [idSchema],
    orderOverview: [idSchema],
    profile: [idSchema],
    editProfile: [idSchema],
    chatList: [idSchema],
    chatScreen: [idSchema],
    chatProfile: [idSchema],
    responses: [idSchema],
    responseOverview: [idSchema],
    serviceRequest: [idSchema],
    calling: [idSchema],
    maps: [idSchema],
    /* ----------------- PARTNER APP SCHEMA FOR EXTRA VARIABLES ----------------- */
    learn: [idSchema],
    courseHome: [idSchema],
    courseList: [idSchema],
    courseDetail: [idSchema],
    topicOverview: [idSchema],
    navigation: [idSchema],
    settingsFor: {
      type: String,
      default: "mobile",
      required: false,
    },
    createdAt: createdAt,
    lastModified: modifiedAt,
    isDeleted: nonReqBool,
  },
  { timestamps: true }
);

module.exports = Mongoose.model("constants", constantsSchema);
