const {
  notificationByToken,
} = require("../routes/firebase_admin/firebase_admin");
const userDB = require("../models/users/userSch");

function sendNotificationByUid(uId, title, body) {
  try {
    userDB.findOne({ uId: uId }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(data.partnerDeviceToken);
        notificationByToken({
          token: data.userDeviceToken,
          title: title,
          body: body,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  sendNotificationByUid,
};
