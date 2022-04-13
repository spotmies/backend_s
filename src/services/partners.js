const pDB = require("../models/partner/partner_registration_sch");
const {
  notificationByToken,
} = require("../routes/firebase_admin/firebase_admin");

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

function sendNotificationByPid(pId, title, body) {
  return new Promise((resolve, reject) => {
    pDB.findOne({ pId: pId }, (err, data) => {
      if (err) {
        reject(err);
      } else {
        notificationByToken(data.partnerDeviceToken, title, body);
      }
    });
  });
}

module.exports = {
  pushRatingsToPartner,
  pushOrdIdToPartner,
  getPartnerDocIdBypId,
  sendNotificationByPid,
};
