const mongoose = require("mongoose");
const {
  reqStr,
  defaultString,
  reqNum,
  nonReqBool,
  modifiedAt,
  createdAt,
  arrSch,
  uniqueNumImmutable,
} = require("../../helpers/schema/schemaHelp");

const servicesListSchema = new mongoose.Schema(
  {
    nameOfService: reqStr,
    smallNameOfService: defaultString,
    description: defaultString,
    serviceId: uniqueNumImmutable,
    sort: reqNum,
    userAppIcon: defaultString,
    userWebIcon: defaultString,
    adminIcon: defaultString,
    partnerAppIcon: defaultString,
    listOfSubServices: arrSch,
    primaryColor: defaultString,
    secondaryColor: defaultString,
    images: arrSch,

    isActive: nonReqBool,
    isDeleted: nonReqBool,
    createdAt: createdAt,
    lastModifiedAt: modifiedAt,
  },
  { timestamps: true }
);

module.exports = mongoose.model("services_list", servicesListSchema);
