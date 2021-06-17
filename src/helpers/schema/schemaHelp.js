//number
const reqNum = {
  type: Number,
  required: true,
};

//string notRequired
const nonReqStr = {
  type: String,
  required: false,
};

//string
const reqStr = {
  type: String,
  required: true,
};

//number notRequired
const nonReqNum = {
  type: Number,
  required: false,
};

//unique number
const uniqueNum = {
  type: Number,
  required: true,
  unique: true,
};

const phoneNum = {
  type: Number,
  required: true,
  unique: true,
  min: 5000000000,
  max: 9999999999,
};

//required timestamps
const timstampValidate = (value) => {
  var n = value.toString();
  if (n.length === 13) return true;
  return false;
};
const timeStamp = {
  required: true,
  immutable: true,
  type: Number,
  min: 0000000000000,
  max: 9999999999999,
  validate: [timstampValidate, "timestamp must be length 13"],
};

//non required timestamps
const nonReqTimeStamp = {
  required: false,
  immutable: true,
  type: Number,
  min: 0000000000000,
  max: 9999999999999,
};

const altNum = {
  required: false,
  type: Number,
  min: 5000000000,
  max: 9999999999,
};
const unChangeUniqueStr = {
  type: String,
  unique: true,
  required: true,
  immutable: true,
  minlength: 13,
  maxlength: 13,
};
const unChangeStr = {
  type: String,
  required: true,
  immutable: true,
};

//unique number notRequired
const nonReqUniqueNum = {
  type: Number,
  required: false,
  unique: true,
};

//unique String
const reqUniqueStr = {
  type: String,
  required: true,
  unique: true,
};

//unique String notRequired
const nonReqUniqueStr = {
  type: String,
  required: false,
  unique: true,
};

var validateEmail = function (email) {
  console.log(email);
  if (email == null) return true;
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const nonReqEmail = {
  required: false,
  type: String,
  unique: true,
  validate: [validateEmail, "Please fill a valid email address"],
  sparse: true,
  index: true,
};

const arrSch = [{ type: String }];

const bool = {
  type: Boolean,
};

const uIdSch = {
  type: String,
  unique: true,
  immutable: true,
  required: true,
};

const dobSch = {
  required: true,
  type: String,
  minlength: 10,
  maxlength: 10,
};

module.exports = {
  reqNum,
  nonReqStr,
  reqStr,
  nonReqNum,
  uniqueNum,
  nonReqUniqueNum,
  reqUniqueStr,
  nonReqUniqueStr,
  unChangeUniqueStr,
  unChangeStr,
  arrSch,
  bool,
  uIdSch,
  dobSch,
  phoneNum,
  altNum,
  nonReqEmail,
  timeStamp,
  nonReqTimeStamp,
};
