const pDB = require("../models/partner/partner_registration_sch");

function pushRatingsToPartner(pId, reviewDoc) {
  console.log("pushRatingsToPartner", pId, reviewDoc);
  try {
    pDB.findOneAndUpdate(
      { pId: pId },
      { $push: { rate: reviewDoc } },
      (err, data) => {}
    );
  } catch (error) {
    console.log(error);
  }
}
function pushOrdIdToPartner(pId, orderDocId) {
  try {
    pDB.findOneAndUpdate(
      { pId: pId },
      { orders: { $push: orderDocId } },
      (err, data) => {}
    );
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  pushRatingsToPartner,
  pushOrdIdToPartner,
};
