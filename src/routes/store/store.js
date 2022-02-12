const express = require("express");
const router = express.Router();
const partnerDB = require("../../models/partner/partner_registration_sch");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");

router.get("/:pId", (req, res) => {
  const pId = req.params.pId;
  try {
    partnerDB
      .findOne({ pId: pId })
      .select(
        "-docs -isDeleted -__v -currentLocation -ref -inComingOrders -orders -acceptance -logs -lastLogin -permission -feedBack -complaints -isTermsAccepted -isDocumentsVerified -enableModifications -appConfig -reports -views"
      )
      .populate({
        path: "catelogs",
        match: { isActive: true, isDeleted: false },
        select: "-views -isActive -isDeleted -__v -lastModified -updatedAt",
      })
      .populate({
        path: "rate",
        match: { isDeleted: false },
        select: "rating description uDetails media createdAt",
        populate: {
          path: "uDetails",
          select: "name pic",
        },
      })
      .exec((err, result) => {
        return processRequest(err, result, res, req);
      });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

module.exports = router;
