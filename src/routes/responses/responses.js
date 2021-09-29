const express = require("express");
const router = express.Router();
const responsesDB = require("../../models/responses/responses_sch");
const orderDB = require("../../models/orders/create_service_sch");
const partnerDB = require("../../models/partner/partner_registration_sch");
const constants = require("../../helpers/constants");
const { parseParams } = require("../../helpers/query/parse_params");

/* -------------------------------------------------------------------------- */
/*                          CREATE RESPONSE FOR USER                          */
/* -------------------------------------------------------------------------- */
router.post(`/${constants.newResponse}`, (req, res) => {
  let data = req.body;
  let updateBlock = {};
  console.log("post resp", data);

  try {
    partnerDB.findOneAndUpdate(
      { pId: data.pId },
      { $pull: { inComingOrders: data.orderDetails } },
      { new: true },
      (err, result) => {
        if (err) {
          console.log(err.message);
          return res.status(400).send(err.message);
        }
        if (data.responseType === "reject") return res.status(200).json(result);
        else {
          try {
            orderDB.findOne({ ordId: data.ordId }, (err, ordData) => {
              if (err) {
                console.log(err.message);
                return res.status(400).send(err.message);
              }
              if (!ordData) return res.status(400).json("invalid ordId");
              if (
                data.responseType === "bid" ||
                data.responseType === "accept"
              ) {
                if (
                  ordData.ordState === "onGoing" ||
                  ordData.ordState === "completed"
                ) {
                  return res
                    .status(400)
                    .send(`this order in status of ${ordData.ordState}`);
                }
                updateBlock = ordData;
                if (data.responseType === "accept") {
                  updateBlock["acceptBy"] = "partner";
                  updateBlock.acceptAt = new Date().valueOf();
                  updateBlock.acceptMoney = ordData.money;
                  updateBlock.pId = data.pId;
                  updateBlock.pDetails = data.pDetails;
                  updateBlock.ordState = "onGoing";

                  data.money = ordData.money;
                  data.isAccepted = true;
                }

                responsesDB
                  .create(data)
                  .then((doc, err) => {
                    if (err) {
                      console.log(err.message);
                      return res.status(400).send(err.message);
                    }
                    if (!doc) return res.status(404).json(doc);
                    updateBlock.responses.push(doc.id);
                    updateBlock.acceptResponse = doc.id;
                    try {
                      orderDB.findOneAndUpdate(
                        { ordId: doc.ordId },
                        updateBlock,
                        { new: true },
                        (err, result) => {
                          if (err) {
                            console.log(err.message);
                            return res.status(400).send(err.message);
                          }
                          return res.status(200).json(doc);
                        }
                      );
                    } catch (err) {
                      if (err) {
                        console.log(err.message);
                        return res.status(400).send(err.message);
                      }
                    }
                  })
                  .catch((err) => {
                    if (err) {
                      console.log(err.message);
                      return res.status(400).send(err.message);
                    }
                  });
              } else {
                return res.status(400).send("check responseType");
              }
            });
          } catch (error) {
            return res.status(500).send(error.message);
          }
        }
      }
    );
  } catch (err) {
    if (err) {
      console.log(err.message);
      return res.status(400).send(err.message);
    }
  }
});

/* -------------------------------------------------------------------------- */
/*                         GET RESPONSE BY RESPONSE ID                        */
/* -------------------------------------------------------------------------- */

router.get(`/${constants.responses}/:ID`, (req, res) => {
  const ID = req.params.ID;

  try {
    responsesDB
      .findOne({ responseId: ID })
      .populate("orderDetails")
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
/*                       UPDATE RESPONSE BY RESPONSE ID                       */
/* -------------------------------------------------------------------------- */
router.put(`/${constants.responses}/:ID`, (req, res, next) => {
  const ID = req.params.ID;
  const body = req.body;
  try {
    responsesDB.findOneAndUpdate(
      { responseId: ID },
      body,
      { new: true },
      (err, data) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (!data) return res.status(404).json(data);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                       DELETE RESPONSE BY RESPONSE ID                       */
/* -------------------------------------------------------------------------- */
router.delete(`/${constants.responses}/:ID`, (req, res) => {
  const ID = req.params.ID;
  const params = parseParams(req.originalUrl);
  var updateField;
  if (params.userType == constants.user) {
    updateField = "isDeletedForUser";
  } else if (params.userType == constants.partner) {
    updateField = "isDeletedForPartner";
  } else {
    return res.status(400).send("please specify userType");
  }
  try {
    responsesDB.findOneAndUpdate(
      { responseId: ID },
      { [updateField]: true },
      (err, data) => {
        if (err) {
          return res.status(400).send(err.message);
        } else {
          return res.status(204).send();
        }
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                      LIST OF RESPONSES BY UID AND PID                      */
/* -------------------------------------------------------------------------- */
router.get(`/:userType/:uId`, (req, res) => {
  const uId = req.params.uId;
  let deleteQuery;
  let userType;
  if (req.params.userType == constants.user) {
    deleteQuery = "isDeletedForUser";
    userType = "uId"
  } else if (req.params.userType == constants.partner) {
    deleteQuery = "isDeletedForPartner";
     userType = "pId"
  } else {
    return res.status(400).send("please specify userType");
  }
  // console.log(userType, uId);
  try {
    responsesDB
      .find({ [userType]: uId, [deleteQuery]: false })
      .populate("orderDetails")
      .populate(
        "pDetails",
        "name eMail phNum partnerPic rate lang experience job loc businessName accountType availability partnerDeviceToken"
      )
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
/*                              GET ALL RESPONSES                             */
/* -------------------------------------------------------------------------- */
router.get(`/${constants.responses}`, (req, res) => {
  try {
    responsesDB
      .find({})
      .populate("orderDetails")
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

module.exports = router;
