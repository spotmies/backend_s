const orderDB = require("../models/orders/create_service_sch");

function addFeedbackIdToOrder(id, body) {
  orderDB.findByIdAndUpdate(
    id,
    { $set: body },
    { new: true },
    (err, data) => {}
  );
}

function getOrderFullDetails(orderDocId) {
  return new Promise((resolve, reject) => {
    try {
      orderDB
        .findById(orderDocId)
        .populate(
          "uDetails",
          "name phNum join pic eMail altNum uId userState lastLogin userDeviceToken"
        )

        .populate({
          path: "pDetails",
          select:
            "name eMail phNum partnerPic rate lang experience job loc businessName accountType availability pId partnerDeviceToken",
          populate: {
            path: "rate",
            select: "rating",
          },
        })
        .populate("acceptResponse")
        .populate(
          "feedBackDetails",
          "rating description media createdAt pDetails"
        )
        .populate("catelog")
        .exec((err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  addFeedbackIdToOrder,
  getOrderFullDetails,
};
