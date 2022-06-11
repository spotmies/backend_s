const express = require("express");
const router = express.Router();
const catelogDB = require("../../models/service_catelogue/service_catelogue");
const partnerDB = require("../../models/partner/partner_registration_sch");
const { getPartnerDocIdBypId } = require("../../services/partners");
const { sendNotificationToAdmin } = require("../../services/users");

/* -------------------------------------------------------------------------- */
/*                   NEW CATELOG CREATE BY PARTNER WITH PID                   */
/* -------------------------------------------------------------------------- */
router.post("/newCatelog/:pId", async function (req, res) {
  let pId = req.params.pId;
  let body = req.body;
  let pDetails = await getPartnerDocIdBypId(body.pId);
  body.pDetails = pDetails;
  try {
    console.log("newCatelog");
    catelogDB
      .init()
      .then(async () => {
        const temp1 = new catelogDB(body);
        const doc = await temp1.save();

        partnerDB.findOneAndUpdate(
          { pId: pId },
          { $push: { catelogs: doc.id } },
          (err) => {
            if (err) return res.status(400).json(err.message);
          }
        );
        sendNotificationToAdmin("new catelog created", `name: ${doc?.name}`);
        return res.json(doc);
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send(err.message);
        }
      });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                           UPDATE CATELOG BY DOCID                          */
/* -------------------------------------------------------------------------- */

router.put("/catelogs/:docId", (req, res) => {
  const docId = req.params.docId;
  const body = req.body;
  body.lastModified = new Date().valueOf();
  try {
    catelogDB.findByIdAndUpdate(
      docId,
      { $set: body },
      { new: true },
      (err, data) => {
        if (err) {
          //console.error(err);
          return res.status(400).json(err.message);
        }
        if (!data) return res.status(404).json(data);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                              GET CATELOG BY ID                             */
/* -------------------------------------------------------------------------- */
router.get("/catelogs/:docId", (req, res) => {
  const docId = req.params.docId;
  try {
    catelogDB
      .findById(docId)
      .select("-__v -isDeleted -isActive -updatedAt -createdAt -lastModified")
      .populate(
        "pDetails",
        "name phNum partnerPic rate lang job loc businessName accountType availability pId partnerDeviceToken"
      )
      .populate({
        path: "reviews",
        select: "rating media description uDetails createdAt",
        populate: {
          path: "uDetails",
          select: "name pic",
        },
      })
      .populate("bookings", "createdAt")
      .exec((err, data) => {
        if (err) {
          //console.error(err);
          return res.status(400).json(err.message);
        }
        if (!data) return res.status(404).json(data);
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                       GET ALL PARTNER CATELOGS BY PID                      */
/* -------------------------------------------------------------------------- */

router.get("/partner/:pId", (req, res) => {
  const pId = req.params.pId;
  let originalUrl = req.query;
  try {
    catelogDB.find(
      { pId: pId, isDeleted: originalUrl.isDeleted ?? false },
      (err, doc) => {
        if (err) return res.status(400).json(err.message);
        return res.status(200).json(doc);
      }
    );
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                           DELETE CATELOG BY DOCID                          */
/* -------------------------------------------------------------------------- */

router.delete("/catelogs/:docId", (req, res) => {
  const docId = req.params.docId;
  let originalUrl = req.query;
  try {
    catelogDB.findByIdAndUpdate(
      docId,
      {
        isDeleted: originalUrl.isDeleted ?? true,
        $set: { lastModified: new Date().valueOf() },
      },
      { new: true },
      (err, data) => {
        if (err) {
          //console.error(err);
          return res.status(400).json(err.message);
        }
        if (!data) return res.status(404).json(data);
        return res.sendStatus(204);
      }
    );
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* ---------------------- GET CATELOGS LIST BY CATEGORY --------------------- */
router.get("/catelog-by-job/:job", (req, res) => {
  const job = req.params.job;
  const skip = parseInt(req?.query?.skip ?? 0);
  const limit = parseInt(req?.query?.limit ?? 10);
  const isActive = req?.query?.isActive ?? true;
  const isDeleted = req?.query?.isDeleted ?? false;
  try {
    catelogDB
      .find({ category: job, isDeleted: isDeleted, isActive: isActive })
      .select("-__v -isDeleted -isActive -updatedAt -createdAt -lastModified")
      .populate(
        "pDetails",
        "name phNum partnerPic rate lang job loc businessName accountType availability pId partnerDeviceToken"
      )
      .populate("reviews", "rating media description uId uDetails createdAt")
      .populate("bookings", "createdAt")
      .skip(skip)
      .limit(limit)
      .exec((err, doc) => {
        if (err) return res.status(400).json(err.message);
        return res.status(200).json(doc);
      });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* ---------------------- GET CATELOGS LIST  --------------------- */

/* ---------------------------------- This api gives the list of catelogs in all category ---------------------------------- */

router.get("/shuffle-1", (req, res) => {
  const skip = parseInt(req?.query?.skip ?? 0);
  const limit = parseInt(req?.query?.limit ?? 10);
  const isActive = req?.query?.isActive ?? true;
  const isDeleted = req?.query?.isDeleted ?? false;
  try {
    catelogDB
      .find({ isDeleted: isDeleted, isActive: isActive })
      .select("-__v -isDeleted -isActive -updatedAt -createdAt -lastModified")
      .populate(
        "pDetails",
        "name phNum partnerPic rate lang job loc businessName accountType availability pId partnerDeviceToken"
      )
      .populate("reviews", "rating media description uId uDetails createdAt")
      .populate("bookings", "createdAt")
      .skip(skip)
      .limit(limit)
      .exec((err, doc) => {
        if (err) return res.status(400).json(err.message);
        return res.status(200).json(doc);
      });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

/* ---------------------- GET CATELOGS LIST BY PRICE LOW TO HIGH --------------------- */

router.get("/shuffle-2", (req, res) => {
  const skip = parseInt(req?.query?.skip ?? 0);
  const limit = parseInt(req?.query?.limit ?? 10);
  const isActive = req?.query?.isActive ?? true;
  const isDeleted = req?.query?.isDeleted ?? false;
  const priceSort = req?.query?.priceSort ?? 1;
  try {
    catelogDB
      .find({ isDeleted: isDeleted, isActive: isActive })
      .sort({ price: priceSort })
      .select("-__v -isDeleted -isActive -updatedAt -createdAt -lastModified")
      .populate(
        "pDetails",
        "name phNum partnerPic rate lang job loc businessName accountType availability pId partnerDeviceToken"
      )
      .populate("reviews", "rating media description uId uDetails createdAt")
      .populate("bookings", "createdAt")
      .skip(skip)
      .limit(limit)
      .exec((err, doc) => {
        if (err) return res.status(400).json(err.message);
        return res.status(200).json(doc);
      });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

router.get("/search/:searchItem", (req, res) => {
  const searchItem = req.params.searchItem;
  const params = req?.query;
  const skip = parseInt(params.skip ?? 0);
  const isActive = params.isActive ?? true;
  const isDeleted = params.isDeleted ?? false;
  let limit = params.limit != undefined ? Number(params.limit) : 5;
  let regex = new RegExp(searchItem, "i");
  catelogDB.find(
    {
      $and: [
        { $or: [{ name: regex }, { description: regex }] },
        { isDeleted: isDeleted, isActive: isActive },
      ],
    },
    null,
    {
      limit: limit,
      skip: skip,
      select: "name media price description range",
    },

    function (err, docs) {
      if (err) return res.status(400).json(err);
      return res.status(200).json({
        success: true,
        type: "catelogs",
        data: docs,
      });
    }
  );
});

module.exports = router;
