const express = require("express");
const router = express.Router();
const orderDB = require("../../models/orders/create_service_sch");
const userDb = require("../../models/users/userSch");
const responsesDB = require("../../models/responses/responses_sch");
const constants = require("../../helpers/constants");
const { notificationByToken } = require("../firebase_admin/firebase_admin");

/* -------------------------------------------------------------------------- */
/*                              create new order                              */
/* -------------------------------------------------------------------------- */
router.post(`/${constants.createOrder}/:uId`, (req, res, next) => {
  const uId = req.params.uId;
  var data = req.body;
  console.log("post data", data);
  try {
    orderDB
      .create(data)
      .then((doc, err) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (!doc) return res.status(404).json(doc);
        try {
          userDb.findOneAndUpdate(
            { uId: uId },
            { $push: { orders: doc.id } },
            { new: true },
            (err, result) => {
              if (err) {
                return res.status(400).json(err.message);
              }
              return res.status(200).json(doc);
            }
          );
        } catch (err) {}

        // return res.status(200).json(doc);
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send(err.message);
        }
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                               GET ORDER BY ID                              */
/* -------------------------------------------------------------------------- */

router.get(`/orders/:ordId`, (req, res) => {
  const ordId = req.params.ordId;
  // let originalUrl = req.query;
  try {
    orderDB
      .findOne({
        ordId: ordId,
        // isDeletedForUser: originalUrl.isDeletedForUser ?? false,
      })
      .populate(
        "uDetails",
        "name phNum join pic eMail altNum uId userState lastLogin userDeviceToken"
      )
      .populate(
        "pDetails",
        "name eMail phNum partnerPic rate lang experience job loc businessName accountType availability pId partnerDeviceToken"
      )
      .populate("acceptResponse")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                            update or edit order                            */
/* -------------------------------------------------------------------------- */
router.put(`/${constants.orders}/:ordId`, (req, res, next) => {
  const ordId = req.params.ordId;
  const body = req.body;
  return updateOrder({
    id: ordId,
    updateBody: body,
    tag: "update",
    response: res,
  });
});

function updateOrder({ id, updateBody, tag = "update", response }) {
  try {
    orderDB.findOneAndUpdate(
      { ordId: id },
      { $set: updateBody },

      { new: true },
      (err, data) => {
        if (err) {
          //console.error(err);
          return response.status(400).send(err.message);
        }
        if (!data) return response.status(404).json(data);
        return response.status(200).json(data);
      }
    );
  } catch (error) {
    return response.status(500).send(error.message);
  }
}

/* -------------------------------------------------------------------------- */
/*                             DELETE ORDER BY ID                             */
/* -------------------------------------------------------------------------- */

router.delete(`/${constants.orders}/:ordId`, (req, res) => {
  //console.log("deleting");
  const ordId = req.params.ordId;
  const originalUrl = req.query;
  return updateOrder({
    id: ordId,
    updateBody: {
      [originalUrl.userType == "partner"
        ? "isDeletedForPartner"
        : "isDeletedForUser"]: true,
    },
    response: res,
    tag: "delete",
  });
});

/* -------------------------------------------------------------------------- */
/*                               GET ALL ORDERS                               */
/* -------------------------------------------------------------------------- */
router.get(`/${constants.orders}`, (req, res) => {
  let originalUrl = req.query;
  console.log("all orders api hit");
  try {
    orderDB.find(
      { isDeletedForUser: originalUrl.isDeletedForUser ?? false },
      (err, data) => {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data || data == null || data == "")
          return res.status(501).json(data);

        res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                       GET ALL ORDERS BY USER/PARTNER                       */
/* -------------------------------------------------------------------------- */
router.get(`/:userType/:uId`, (req, res) => {
  let originalUrl = req.query;
  const uOrPId = req.params.uId;
  let deleteQuery;
  let deleteField = false;
  let userType;
  if (req.params.userType == constants.user) {
    userType = "uId";
    deleteQuery = "isDeletedForUser";
    deleteField = originalUrl.isDeletedForUser ?? false;
  } else if (req.params.userType == constants.partner) {
    userType = "pId";
    deleteQuery = "isDeletedForPartner";
    deleteField = originalUrl.isDeletedForPartner ?? false;
  } else {
    userType = "unknown";
    deleteQuery = "unknown";
    deleteField = true;
  }

  try {
    orderDB
      .find({ [userType]: uOrPId, [deleteQuery]: deleteField })
      .sort({ join: -1 })
      .populate(
        "uDetails",
        "name phNum join pic eMail altNum uId userState lastLogin userDeviceToken"
      )
      .populate(
        "pDetails",
        "name eMail phNum partnerPic rate lang experience job loc businessName accountType availability pId partnerDeviceToken"
      )
      .populate("acceptResponse")
      .populate("feedBackDetails")
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                             GET ALL USER ORDERS                            */
/* -------------------------------------------------------------------------- */
// router.get(`/user/:uId`, (req, res) => {
//   const uId = req.params.uId;
//   let originalUrl = req.query;
//   try {
//     orderDB.find(
//       { uId: uId, isDeletedForUser: originalUrl.isDeletedForUser ?? false },
//       (err, data) => {
//         if (err) {
//           //console.error(err);
//           return res.status(400).send(err.message);
//         }
//         return res.status(200).json(data);
//       }
//     );
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// });

/* -------------------------------------------------------------------------- */
/*                         GET ALL PARTNER ORDERS HERE                        */
/* -------------------------------------------------------------------------- */

// router.get(`/partner/:pId`, (req, res) => {
//   const pId = req.params.pId;
//   let originalUrl = req.query;
//   try {
//     orderDB.find(
//       { pId: pId,isDeletedForPartner:originalUrl.isDeletedForPartner ?? false},
//       (err, data) => {
//         if (err) {
//           //console.error(err);
//           return res.status(400).send(err.message);
//         }
//         return res.status(200).json(data);
//       }
//     );
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// });

/* -------------------------------------------------------------------------- */
/*                 ORDER CONFIRM OR CANCEL BY USER OR PARTNER                 */
/* -------------------------------------------------------------------------- */

router.post("/stateChange", function (req, res) {
  const body = req.body;
  if (body.responseType === "accept") {
    try {
      orderDB.findOne(
        { ordId: body.ordId, isDeletedForUser: false },
        (err, ordData) => {
          if (err) {
            //console.error(err);
            return res.status(400).send(err.message);
          }
          if (!ordData) {
            return res.status(501).json(ordData);
          }
          // if (
          //   ordData.ordState === "onGoing" ||
          //   ordData.ordState === "completed"
          // ) {
          //   return res
          //     .status(400)
          //     .send(`this order in status of ${ordData.ordState}`);
          // }
          if (ordData.orderState > 6) {
            return res
              .status(400)
              .send(`this order in status of ${ordData.orderState}`);
          }
          orderDB.findOneAndUpdate(
            { ordId: body.ordId, isDeletedForUser: false },
            { $set: req.body },
            { new: true },
            (err, data) => {
              if (err) {
                //console.error(err);
                return res.status(400).send(err.message);
              }
              try {
                responsesDB.findByIdAndUpdate(
                  body.acceptResponse,
                  {
                    isAccepted: true,
                    isDeletedForUser: true,
                  },
                  (err, data2) => {
                    if (err) {
                      return res.status(400).send(err.message);
                    }
                    return res.status(200).json(data);
                  }
                );
              } catch (error) {
                return res.status(500).send(error.message);
              }
            }
          );
        }
      );

      notificationByToken({
        token: body.deviceToken,
        title:
          body.notificationTitle ??
          `${body.userName ?? ""} accepted your request `,
        body:
          body.notificationBody ??
          "Order accepted click here for more infomation",
        data: body,
      });
    } catch (error) {
      return res.status(500).send(error.message);
    }
  } else if (body.responseType === "reject") {
    try {
      responsesDB.findByIdAndUpdate(
        body.acceptResponse,
        {
          isAccepted: false,
          isDeletedForUser: true,
        },
        (err, data2) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          return res.status(204).send();
        }
      );
    } catch (error) {
      return res.status(500).send(error.message);
    }
  } else return res.status(400).send("please check responseType");
});

router.post("/revealProfile", (req, res) => {
  const body = req.body;
  var updateBlock = "$push";
  if (body.revealProfile == "false" || !body.revealProfile) {
    updateBlock = "$pull";
  }
  try {
    orderDB.findOneAndUpdate(
      { ordId: body.ordId },
      { [updateBlock]: { revealProfileTo: body.pId } },
      { new: true },
      (err, data) => {
        if (err) {
          //console.error(err);
          return res.status(400).send(err.message);
        }
        if (data == null || !data || data == undefined)
          return res.status(400).send("check ordId");
        return res.status(200).send(data);
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
