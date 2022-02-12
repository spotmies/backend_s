const pDB = require("../models/partner/partner_registration_sch");

function pushRatingsToPartner(pId, reviewDoc) {
  try {
    pDB.findOneAndUpdate({ pId: pId }, { $push: { rate: reviewDoc } });
  } catch (error) {
    console.log(error);
  }
}
function pushOrdIdToPartner(pId, orderDocId) {
  try {
    pDB.findOneAndUpdate({ pId: pId }, { $push: { orders: orderDocId } });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  pushRatingsToPartner,
  pushOrdIdToPartner,
};
