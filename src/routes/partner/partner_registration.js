const express = require("express");
const router = express.Router();
const partnerDB = require("../../models/partner/partner_registration_sch");
const constants = require("../../helpers/constants");
const complaintR = require("./complaints");
const { parseParams } = require("../../helpers/query/parse_params");

/* -------------------------------------------------------------------------- */
/*                                 NEW PARTNER                                */
/* -------------------------------------------------------------------------- */

router.post(`/${constants.newPartner}`, (req, res, next) => {
  var data = req.body;
  console.log("newPart", data);
  console.log(data.docs);
  if (
    req.body.docs != null ||
    req.body.docs != "" ||
    req.body.docs != undefined
  ) {
    if (typeof req.body.docs == "string") {
      let newDoc = JSON.parse(req.body.docs);
      data["docs"] = newDoc;
    } else console.log("doc not a string");
  }
  console.log("parsed", data);
  try {
    partnerDB
      .create(data)
      .then((doc, err) => {
        if (err) {
          console.log(err);

          return res.status(400).send(err.message);
        }
        if (!doc) return res.status(404).json(doc);
        return res.status(200).json(doc);
      })
      .catch((err) => {
        if (err) {
          console.log(err);

          return res.status(400).send(err.message);
        }
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                         GET PARTNER DETAILS BY PID                         */
/* -------------------------------------------------------------------------- */
router.get(`/${constants.getPartner}/:pId`, (req, res) => {
  const pId = req.params.pId;
  let originalUrl = parseParams(req.originalUrl);
  console.log(originalUrl);
  //commentt
  try {
    partnerDB
      .findOne({ pId: pId })
      .populate({
        path: originalUrl.extractData == "true" ? "reports.reportedBy" : "null",
      })
      .populate({
        path: originalUrl.extractData == "true" ? "complaints" : "null",
      })
      .populate({
        path: originalUrl.extractData == "true" ? "inComingOrders" : "null",
        match: {
          ordState: originalUrl.ordState ?? "req",
        },
        populate: { path: "uDetails" },
      })
      .populate({
        path: originalUrl.extractData == "true" ? "orders" : "null",
      })
      // .populate({
      //   path:
      //     originalUrl.extractData == "true"
      //       ? "inComingOrders.uDetails"
      //       : "null",
      // })
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data) return res.status(404).send("data not found");
        switch (originalUrl.showOnly) {
          case "inComingOrders":
            res.status(200).json(data.inComingOrders);
            break;
          case "complaints":
            res.status(200).json(data.complaints);
          case "orders":
            res.status(200).json(data.orders);
            break;

          default:
            res.status(200).json(data);
            break;
        }
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                           UPDATE PARTNER DETAILS                           */
/* -------------------------------------------------------------------------- */

router.put(`/${constants.getPartner}/:pId`, (req, res) => {
  const pId = req.params.pId;
  const body = req.body;

  try {
    partnerDB.findOneAndUpdate(
      { pId: pId },
      body,
      { new: true },
      (err, data) => {
        if (err) {
          //console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data) return res.status(404).json(data);
        if (body.lastLogin) {
          try {
            partnerDB.findOneAndUpdate(
              { pId: pId },
              { $push: { logs: body.lastLogin } },
              { new: true },
              (err, doc) => {}
            );
          } catch (error) {}
        }
        console.log("updated data>>>",data);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                             DELETE PARTNER WITH PID                        */
/* -------------------------------------------------------------------------- */
router.delete(`/${constants.getPartner}/:pId`, (req, res) => {
  //console.log("deleting");
  const pId = req.params.pId;
  try {
    partnerDB.findOneAndRemove({ pId: pId }, (err) => {
      if (err) {
        //console.error(err);
        return res.status(400).send(err.message);
      } else {
        partnerDB.findOne({ pId: pId }, (err, doc) => {
          if (err) return res.status(400).send(err.message);
          if (!doc) {
            return res.status(204).send();
          } else return res.status(400).send("not deleted");
        });
      }
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                                GET ALL PARTNER DETAILS                     */
/* -------------------------------------------------------------------------- */

router.get(`/${constants.getPartner}`, (req, res) => {
  try {
    partnerDB.find({}, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(400).send(err.message);
      }
      res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                         RAISE COMPLAINT ON PARTNER                         */
/* -------------------------------------------------------------------------- */
router.use("/complaint", complaintR);

/* -------------------------------------------------------------------------- */
/*                           REPORT PARTNER BY USER                           */
/* -------------------------------------------------------------------------- */
router.put("/report", (req, res) => {
  const body = req.body;
  const report = req.body.report;
  try {
    partnerDB.findOneAndUpdate(
      { pId: body.pId },
      { $push: { reports: report } },
      { new: true },
      (err, data) => {
        if (err) return res.status(400).send(err.message);
        if (data == null || !data || data == "")
          return res.status(400).send("doc not updated");
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    if (error) return res.status(500).send(error.message);
  }
});

module.exports = router;
