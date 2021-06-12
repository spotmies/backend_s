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
};
