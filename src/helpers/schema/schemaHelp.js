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

module.exports = {
  reqNum,
  nonReqStr,
  reqStr,
  nonReqNum,
  uniqueNum,
  nonReqUniqueNum,
  reqUniqueStr,
  nonReqUniqueStr,
};
