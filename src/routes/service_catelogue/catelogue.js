const express = require("express");
const router = express.Router();
const catelogDB = require("../../models/service_catelogue/service_catelogue");
const partnerDB = require("../../models/partner/partner_registration_sch");

/* -------------------------------------------------------------------------- */
/*                   NEW CATELOG CREATE BY PARTNER WITH PID                   */
/* -------------------------------------------------------------------------- */
router.post("/newCatelog/:pId", function (req, res) {
  let pId = req.params.pId;
  let body = req.body;
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
    catelogDB.findById(docId, (err, doc) => {
      if (err) return res.status(400).json(err.message);
      return res.status(200).json(doc);
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

module.exports = router;
