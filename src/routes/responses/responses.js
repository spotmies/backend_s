const express = require("express");
const router = express.Router();
const responsesDB = require("../../models/responses/responses_sch");
const orderDB = require("../../models/orders/create_service_sch");
const constants = require("../../helpers/constants");
const { parseParams } = require("../../helpers/query/parse_params");

/* -------------------------------------------------------------------------- */
/*                          CREATE RESPONSE FOR USER                          */
/* -------------------------------------------------------------------------- */
router.post(`/${constants.newResponse}`, (req, res, next) => {
  const data = req.body;
  console.log("post resp", data);
  try {
    // try {
    orderDB.findOne({ ordId: data.ordId }, (err, ordData) => {
      if (err) {
        console.log(err.message);
        return res.status(400).send(err.message);
      }
      if (!ordData) return res.status(404).json("invalid ordId");
      responsesDB
        .create(data)
        .then((doc, err) => {
          if (err) {
            console.log(err.message);
            return res.status(400).send(err.message);
          }
          if (!doc) return res.status(404).json(doc);
          // return res.status(200).json(doc);
          try {
            orderDB.findOneAndUpdate(
              { ordId: doc.ordId },
              { $push: { responses: doc.id } },
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
    });
    // }
    //  catch (error) {
    //   return res.status(500).send(error.message);
    // }
  } catch (error) {
    return res.status(500).send(error.message);
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
  if(params.userType == constants.user){
    updateField = "isDeletedForUser"
  }
  else if(params.userType == constants.partner){
    updateField = "isDeletedForPartner"
  }
  else{
    return res.status(400).send("please specify userType");
  }
  try {
    responsesDB.findOneAndUpdate({responseId: ID},{[updateField] : true},(err,data) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      else {
        return res.status(204).send();
      }
    })
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
  //  =
  //   req.params.userType == constants.user
  //     ? "uId"
  //     : req.params.userType == constants.partner
  //     ? "pId"
  //     : null;
  if(req.params.userType ==  constants.user){
      deleteQuery = "isDeletedForUser"
  }
  else if(req.params.userType ==  constants.partner){
    deleteQuery = "isDeletedForPartner"
  }
    else{
    return res.status(400).send("please specify userType");
  }
  // console.log(userType, uId);
  try {
    responsesDB
      .find({ [userType]: uId, [deleteQuery] : false })
      .populate("orderDetails")
      .populate(
        "pDetails",
        "name eMail phNum partnerPic rate lang experience job loc businessName accountType availability"
      )
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data || data == null || data == "")
          return res.status(501).json(data);
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
