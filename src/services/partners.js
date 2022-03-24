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

function getPartnerDocIdBypId(pId) {
  return new Promise((resolve, reject) => {
    pDB.findOne({ pId: pId }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data._id);
      }
    });
  });
}

module.exports = {
  pushRatingsToPartner,
  pushOrdIdToPartner,
  getPartnerDocIdBypId,
};
