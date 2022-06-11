const {
  notificationByToken,
} = require("../routes/firebase_admin/firebase_admin");
const notificationDB = require("../models/notifications/notifications");
const partnerDB = require("../models/partner/partner_registration_sch");
const userDB = require("../models/users/userSch");

function sendNotificationToAdmin(title, message) {
  const admins = [8341980196, 8019933883, 7993613685, 9999999999];
  admins.forEach((admin) => {
    sendNotificationByUid(admin, title, message);
  });
}

function sendNotificationByUid(uId, title, body) {
  try {
    partnerDB.findOne(
      {
        $or: [{ pId: uId }, { phNum: uId }],
      },
      (err, data) => {
        if (err) {
          console.log(err);
        } else if (!data) {
          userDB.findOne(
            {
              $or: [{ pId: uId }, { phNum: uId }],
            },
            (err2, dataa) => {
              if (err2) {
                console.log(err);
              } else if (!dataa) {
                return;
              } else {
                notificationByToken({
                  token: dataa?.userDeviceToken,
                  title: title,
                  body: body,
                });
              }
            }
          );
        } else {
          // console.log(data.partnerDeviceToken);
          notificationByToken({
            token: data.partnerDeviceToken,
            title: title,
            body: body,
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}

function saveNotification({ token, title, body, nData } = {}) {
  userDB.findOne({ userDeviceToken: token }, (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else if (!data) {
      //check for partner
      partnerDB.findOne({ partnerDeviceToken: token }, (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        if (!data) {
          return;
        } else {
          notificationDB.create(
            {
              title: title,
              body: body,
              data: nData,
              partner: data._id,
            },
            (err, data) => {}
          );
        }
      });
    } else {
      notificationDB.create(
        {
          title: title,
          user: data._id,
          body: body,
          data: nData ?? {},
        },
        (err, data) => {}
      );
    }
  });
}
module.exports = {
  sendNotificationByUid,
  saveNotification,
  sendNotificationToAdmin,
};
