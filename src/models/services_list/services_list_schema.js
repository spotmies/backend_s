const mongoose = require("mongoose");
const { reqStr, defaultString, reqNum, nonReqBool, modifiedAt,createdAt, uniqueNum } = require("../../helpers/schema/schemaHelp");

const servicesListSchema = new mongoose.Schema({
    nameOfService: reqStr,
    description: defaultString,
    serviceId:uniqueNum,
    sort:reqNum,
    userAppIcon:defaultString,
    userWebIcon:defaultString,
    adminIcon:defaultString,
    partnerAppIcon:defaultString,

    isActive:nonReqBool,
    isDeleted:nonReqBool,
    createdAt:createdAt,
    lastModifiedAt:modifiedAt,



},{timestamps:true});