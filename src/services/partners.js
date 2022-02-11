const pDB = require("../models/partner/partner_registration_sch");

function pushRatingsToPartner(pId, reviewDoc) {
  try {
    pDB.findOneAndUpdate({ pId: pId }, { $push: { rate: reviewDoc } });
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  pushRatingsToPartner,
};
