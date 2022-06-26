const express = require("express");
const router = express.Router();
const catelogDB = require("../../models/service_catelogue/service_catelogue");
const partnerDB = require("../../models/partner/partner_registration_sch");
const {
  getPartnerDocIdBypId,
  sendNotificationByPid,
} = require("../../services/partners");
const { sendNotificationToAdmin } = require("../../services/users");

/* -------------------------------------------------------------------------- */
/*                   NEW CATELOG CREATE BY PARTNER WITH PID                   */
/* -------------------------------------------------------------------------- */

function createCatelogAndPush(pId, body, res) {
  console.log("body", body);
  return new Promise((resolve, reject) => {
    try {
      catelogDB.create(body, (err, doc) => {
        if (err) {
          if (res) return res.status(400).send(error.message);
          resolve({
            success: false,
            message: error.message,
          });
        } else if (doc) {
          partnerDB.findOneAndUpdate(
            { pId: pId },
            { $push: { catelogs: doc.id } },
            (err) => {
              if (err) return res.status(400).json(err.message);
            }
          );
          sendNotificationToAdmin("new catelog created", `name: ${doc?.name}`);
          if (res) return res.json(doc);
          resolve({
            success: true,
            message: "catelog created",
            data: doc,
          });
        }
      }); // end of catelogDB.create
    } catch (error) {
      if (res) return res.status(400).send(error.message);
      resolve({
        success: false,
        message: error.message,
      });
    }
  });
}

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

router.put("/catelogs/:docId", async (req, res) => {
  const docId = req.params.docId;
  const body = req.body;
  body.lastModified = new Date().valueOf();
  try {
    const oldData = await catelogDB.findById(docId);
    catelogDB.findByIdAndUpdate(
      docId,
      { $set: body },
      { new: true },
      (err, data) => {
        console.log(oldData);
        if (err) {
          //console.error(err);
          return res.status(400).json(err.message);
        }
        if (!data) return res.status(404).json(data);
        if (!data.isVerified)
          sendNotificationToAdmin(
            "catelog updated",
            `name: ${data?.name} please verify it`
          );
        if (!oldData?.isVerified && data?.isVerified) {
          sendNotificationToAdmin("catelog verified", `name: ${data?.name}`);
          sendNotificationByPid(
            data?.pId,
            "Catelog verified",
            `Your catelog "${data?.name}" verified, please check it`
          );
        }
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
  const isVerified = req?.query?.isVerified ?? true;
  try {
    catelogDB
      .find({
        category: job,
        isDeleted: isDeleted,
        isActive: isActive,
        isVerified: isVerified,
      })
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
  const isVerified = req?.query?.isVerified ?? true;
  try {
    catelogDB
      .find({
        isDeleted: isDeleted,
        isActive: isActive,
        isVerified: isVerified,
      })
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
  const isVerified = req?.query?.isVerified ?? true;
  try {
    catelogDB
      .find({
        isDeleted: isDeleted,
        isActive: isActive,
        isVerified: isVerified,
      })
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
  const isVerified = req?.query?.isVerified ?? true;
  let limit = params.limit != undefined ? Number(params.limit) : 5;
  let regex = new RegExp(searchItem, "i");
  catelogDB.find(
    {
      $and: [
        { $or: [{ name: regex }, { description: regex }] },
        { isDeleted: isDeleted, isActive: isActive, isVerified: isVerified },
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

/* ---------------- CREATE A DUMMY LIST CATELOGS FOR PARTNER ---------------- */
router.get("/assign-catelogs/:pid", (req, res) => {
  const pid = req.params.pid;
  const notRequiredFields = [
    "__v",
    "isDeleted",
    "isActive",
    "updatedAt",
    "createdAt",
    "lastModified",
    "_id",
    "isDummy",
    "isVerified",
    "isUpdated",
  ];
  try {
    partnerDB.findOne({ pId: pid }, (err, partner) => {
      if (partner) {
        catelogDB.find(
          { isDummy: true, category: partner?.job, isDeleted: false },
          (err, docs) => {
            if (err) return res.status(400).json(err);
            if (docs.length < 1) {
              return res.status(404).json({ error: "No catelogs found" });
            }
            docs.forEach(async (catelog, key) => {
              let newBody = {};
              Object.keys(catelog["_doc"]).forEach((key) => {
                if (!notRequiredFields.includes(key)) {
                  newBody[key] = catelog["_doc"][key];
                }
              });
              // newBody.name = catelog.name;
              // newBody.media = catelog.media;
              // newBody.price = catelog.price;
              // newBody.description = catelog.description;
              // newBody.range = catelog.range;
              // newBody.category = catelog.category;
              // newBody.termsAndConditions = catelog.termsAndConditions;
              // newBody.note = catelog.note;
              // newBody.warrantyDays = catelog.warrantyDays;
              // newBody.warrantyDetails = catelog.warrantyDetails;
              // newBody.isWarranty = catelog.isWarranty;
              // newBody.cashOnService = catelog.cashOnService;
              // newBody.daysToComplete = catelog.daysToComplete;
              // newBody.hoursToComplete = catelog.hoursToComplete;
              // newBody.whatIncluds = catelog.whatIncluds;
              // newBody.whatNotIncluds = catelog.whatNotIncluds;
              // newBody.faq = catelog.faq;
              // newBody.sorting = catelog.sorting;
              // newBody.maxRange = catelog.maxRange;
              newBody.pId = partner.pId;
              newBody.pDetails = partner._id;
              newBody.itemCode = key + 1;
              newBody.isUpdated = false;
              newBody.errorMessage =
                "Please update your catelog (price,images,description,etc..,)";

              // return res.status(200).json(newBody);
              const resp = await createCatelogAndPush(partner.pId, newBody);
              console.log(resp);
              if (key == docs.length - 1) {
                return res.status(200).json({
                  success: true,
                  type: "catelogs",
                  data: docs,
                });
              }
            });
          }
        );
      } else {
        return res.status(400).json("Partner not found");
      }
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//dummy testing api for schema updates
router.get("/update-schema", (req, res) => {
  // update new schema variables
  catelogDB.updateMany(
    { pId: "Lz7SJsnDcZefgoc69Ik5vgL6meb2" },
    {
      $set: {
        isDummy: true,
        errorMessage:
          "Please update your catelog (price,images,description,etc..,)",
      },
    },
    (err, docs) => {
      if (err) return res.status(400).json(err);
      return res.status(200).json({
        success: true,
        type: "catelogs",
        data: docs?.length,
      });
    }
  );
});

module.exports = router;
