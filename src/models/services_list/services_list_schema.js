const mongoose = require("mongoose");
const {
  reqStr,
  nonReqBool,
  modifiedAt,
  createdAt,
  arrSch,
  uniqueNumImmutable,
  nonReqStr,
  defaultNum,
  mediaSch,
} = require("../../helpers/schema/schemaHelp");

const servicesListSchema = new mongoose.Schema(
  {
    nameOfService: reqStr,
    smallNameOfService: nonReqStr,
    description: nonReqStr,
    serviceId: uniqueNumImmutable,
    sort: defaultNum,
    sort2: defaultNum,
    sort3: defaultNum,
    sort4: defaultNum,
    sort5: defaultNum,
    sort6: defaultNum,
    userAppIcon: nonReqStr,
    userWebIcon: nonReqStr,
    adminIcon: nonReqStr,
    partnerAppIcon: nonReqStr,
    subServices: [
      { type: mongoose.Schema.Types.ObjectId, ref: "services_list" },
    ],
    isMainService: nonReqBool,
    userWebPrimaryColor: nonReqStr,
    userWebSecondaryColor: nonReqStr,
    userAppPrimaryColor: nonReqStr,
    userAppSecondaryColor: nonReqStr,
    adminPrimaryColor: nonReqStr,
    adminSecondaryColor: nonReqStr,
    partnerAppPrimaryColor: nonReqStr,
    partnerAppSecondaryColor: nonReqStr,

    images: arrSch,
    media: [mediaSch],

    visibleToUser: nonReqBool,
    visibleToWeb: nonReqBool,
    visibleToPartner: nonReqBool,

    isActive: nonReqBool,
    isDeleted: nonReqBool,
    createdAt: createdAt,
    lastModifiedAt: modifiedAt,
  },
  { timestamps: true }
);

module.exports = mongoose.model("services_list", servicesListSchema);
