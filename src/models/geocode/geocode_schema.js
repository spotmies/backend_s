const mongoose = require("mongoose");
const {
  nonReqStr,
  nonReqNum,
} = require("../../helpers/schema/schemaHelp");

const geocode_schema = {
subLocality:nonReqStr,
locality:nonReqStr,
coordinates:{
    latitude:nonReqNum,
    logitude:nonReqNum
},
addressLine:nonReqStr,
subAdminArea:nonReqStr ,
postalCode:nonReqNum,
adminArea:nonReqStr ,
subThoroughfare:nonReqStr ,
featureName:nonReqStr ,
thoroughfare: nonReqStr
}
module.exports = mongoose.model("geocode", geocode_schema);
