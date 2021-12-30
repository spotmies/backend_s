const mongoose = require("mongoose");

//required timestamps
const timstampValidate = (value) => {
  var n = value.toString();
  if (n.length === 13) return true;
  return false;
};

//number
const reqNum = {
  type: Number,
  required: true,
};
const defaultNum = {
  type: Number,
  default: 0,
  required:false
};

//string notRequired
const nonReqStr = {
  type: String,
  required: false,
};

const createdAt = {
  required: false,
  immutable: true,
  type: Number,
  min: 0000000000000,
  max: 9999999999999,
  validate: [timstampValidate, "createdAt must be length 13"],
  default: Date.now,
};



const defaultString = {
  type: String,
  default: "",
  required: false,
};

const settingId = {
  type: String,
  required: true,
  minlength: 4,

}

const constantsId = {
  type:String,
  required:true,
  minlength:4,
  unique:true,
  immutable:true,
}

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

const reqArrOfNum = {
  type: [Number],
  required: true,

};

const arrOfNum = {
  type: [Number],
  required: false,
};


const timeStamp = {
  required: false,
  immutable: true,
  type: Number,
  min: 0000000000000,
  max: 9999999999999,
  validate: [timstampValidate, "timestamp must be length 13"],
  default: new Date().valueOf(),
};

const modifiedAt = {
  required: false,
  immutable: false,
  type: Number,
  min: 0000000000000,
  max: 9999999999999,
  validate: [timstampValidate, "modifiedAt must be length 13"],
  default: Date.now,
};

const orderSchedule = {
  required: false,
  type: Number,
  min: 0000000000000,
  max: 9999999999999,
  validate: [timstampValidate, "timestamp must be length 13"],
  default: new Date().valueOf(),
};
const responseSchedule = {
  required: false,
  type: Number,
  min: 0000000000000,
  max: 9999999999999,
  validate: [timstampValidate, "timestamp must be length 13"],
};
const upStatesAndCounts = {
  required: false,
  type: Number,
  default: 1,
};
//non required timestamps
const nonReqTimeStamp = {
  required: false,
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
const ordIdSch = {
  unique: true,
  required: true,
  immutable: true,
  type: Number,
  validate: [timstampValidate, "Id must be length 13"],
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

const reqEmail = {
  required: true,
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
  minlength: 4,
};

const dobSch = {
  required: true,
  type: String,
};
const unChangeNum = {
  type: Number,
  immutable: true,
  required: true,
};
const uniqueNumImmutable = {
  type: Number,
  immutable: true,
  required: true,
  unique: true,
}
const isVerifedSch = {
  required: false,
  default: false,
  type: Boolean,
};
const nonReqBool = {
  required: false,
  default: false,
  type: Boolean,
};
const reqBool = {
  required: true,
  type: Boolean,
};

const viewsSchema = new mongoose.Schema(
  {
    uId: reqStr,
    createdAt: createdAt,
    uDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      immutable: true,
      ref: "users",
    },
    required: false,
  },
  { timestamps: true }
);



module.exports = {
  reqBool,
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
  constantsId,
  dobSch,
  defaultString,
  phoneNum,
  altNum,
  nonReqEmail,
  timeStamp,
  nonReqTimeStamp,
  ordIdSch,
  modifiedAt,
  unChangeNum,
  upStatesAndCounts,
  responseSchedule,
  orderSchedule,
  isVerifedSch,
  createdAt,
  nonReqBool,
  settingId,
  uniqueNumImmutable,
  reqEmail,
  reqArrOfNum,
  arrOfNum,
  defaultNum,
  viewsSchema
};
