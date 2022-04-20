const express = require("express");
const router = express.Router();
const partnerDB = require("../../models/partner/partner_registration_sch");
const constants = require("../../helpers/constants");
const complaintR = require("./complaints");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");

/* -------------------------------------------------------------------------- */
/*                                 NEW PARTNER                                */
/* -------------------------------------------------------------------------- */

router.post(`/${constants.newPartner}`, (req, res, next) => {
  let data = req.body;
  data.permission = 10;
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
  let originalUrl = req.query;
  console.log(originalUrl);
  //commentt
  try {
    partnerDB
      .findOne({ pId: pId })
      .populate({
        path:
          originalUrl.extractData == "true" ? "reports.reportedBy" : "catelogs",
      })
      .populate({
        path: originalUrl.extractData == "true" ? "complaints" : "catelogs",
      })
      .populate({
        path: originalUrl.extractData == "true" ? "inComingOrders" : "catelogs",
        // match: {
        //   ordState: originalUrl.ordState ?? "req",
        // },
        populate: {
          path: "uDetails",
          select:
            "name phNum uId userState altNum eMail pic lastLogin userDeviceToken",
        },
      })

      .populate({
        path: originalUrl.extractData == "true" ? "orders" : "catelogs",
      })
      .populate({
        path: originalUrl.extractData == "true" ? "catelogs" : "catelogs",
        match: { isDeleted: false },
      })
      .populate("rate", "rating description")

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
/*                              PARTNER LOGIN API                             */
/* -------------------------------------------------------------------------- */

router.post("/login", function (req, res) {
  const body = req.body;
  const pId = body.pId;

  try {
    partnerDB.findOneAndUpdate(
      { pId: pId },
      {
        $push: { logs: body.lastLogin },
        partnerDeviceToken: body.partnerDeviceToken,
        isActive: body.isActive ?? true,
      },
      (err, doc) => {
        return processRequest(err, doc, res, req, { noContent: true });
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* ------------------------------- Logout api ------------------------------- */

router.post("/logout", function (req, res) {
  const pId = req.body.pId;
  try {
    partnerDB.findOneAndUpdate(
      { pId: pId },
      { $set: { isActive: false } },
      (err, doc) => {
        return processRequest(err, doc, res, req, { noContent: true });
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* -------------------------------------------------------------------------- */
/*                           UPDATE PARTNER DETAILS                           */
/* -------------------------------------------------------------------------- */

router.put(`/${constants.getPartner}/:pId`, (req, res) => {
  const pId = req.params.pId;
  var body = req.body;
  if (
    req.body.docs != null ||
    req.body.docs != "" ||
    req.body.docs != undefined
  ) {
    if (typeof req.body.docs == "string") {
      let newDoc = JSON.parse(req.body.docs);
      body["docs"] = newDoc;
    } else console.log("doc not a string");
  }
  try {
    partnerDB.findOneAndUpdate(
      { pId: pId },
      { $set: body },
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
        console.log("updated data>>>", data);
        return res.status(200).send(data);
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

router.get(`/all-partners`, (req, res) => {
  const isDeleted = req.query.isDeleted ?? false;
  try {
    partnerDB
      .find({ isDeleted: isDeleted, permission: 10 })
      .populate("rate", "rating")
      .exec((err, data) => {
        return processRequest(err, data, res, req);
      });
  } catch (error) {
    return catchFunc(error, res, req);
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

/* ----------------- Get nearest partner using geo location ----------------- */

router.get("/nearest-partner", (req, res) => {
  const lat = req.query?.lat;
  const log = req.query?.log;
  const maxDistance = req.query?.maxDistance ?? 100000;
  const minDistance = req.query?.minDistance ?? 10;
  const job = req.query?.job;
  const skip = parseInt(req?.query?.skip ?? 0);
  const limit = parseInt(req?.query?.limit ?? 10);
  // const availability = req.query.availability ?? true;
  let block = {
    isDeleted: false,
    partnerState: "active",
    permission: { $gt: 9 },
  };
  if (job != undefined || job != null) block.job = job;
  try {
    partnerDB
      .find({
        workLocation: {
          $near: {
            $geometry: { type: "Point", coordinates: [lat, log] },
            $minDistance: minDistance,
            $maxDistance: maxDistance,
          },
        },
        ...block,
      })
      .select(
        "pId name workLocation job partnerPic perAdd phNum accountType businessName collegeName isActive"
      )
      .skip(skip)
      .limit(limit)
      .exec((err, data) => {
        return processRequest(err, data, res, req);
      });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ---------------------------- get partner list ---------------------------- */

router.get("/partner-list", (req, res) => {
  const skip = parseInt(req.query.skip ?? 0);
  const limit = parseInt(req?.query?.limit ?? 2);

  try {
    partnerDB
      .find({ isDeleted: false, permission: 10 })
      .select(
        "name pId partnerPic accountType businessName lang job workLocation rate phNum partnerDeviceToken"
      )
      .populate("rate", "rating")
      .skip(skip)
      .limit(limit)
      .exec((err, data) => {
        return processRequest(err, data, res, req);
      });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ------------------------ FORWARD ORDER TO PARTNER ------------------------ */

router.post("/forward-order", (req, res) => {
  const orderDocId = req.body.orderDocId;
  const partnerDocId = req.body.partnerDocId;
  try {
    partnerDB.findByIdAndUpdate(
      partnerDocId,
      {
        $addToSet: { inComingOrders: orderDocId },
      },
      (err, data) => {
        if (err) return res.status(400).send(err.message);
        if (data == null || !data || data == "")
          return res
            .status(400)
            .json({ success: true, message: "partner not found" });
        return res
          .status(200)
          .json({ success: true, message: "order forwarded" });
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ------------------------ REMOVE ORDER TO PARTNER ------------------------ */

router.post("/remove-order", (req, res) => {
  const orderDocId = req.body.orderDocId;
  const partnerDocId = req.body.partnerDocId;
  try {
    partnerDB.findByIdAndUpdate(
      partnerDocId,
      {
        $pull: { inComingOrders: orderDocId },
      },
      (err, data) => {
        if (err) return res.status(400).send(err.message);
        if (data == null || !data || data == "")
          return res
            .status(400)
            .json({ success: true, message: "partner not found" });
        return res
          .status(200)
          .json({ success: true, message: "order forwarded" });
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

module.exports = router;
