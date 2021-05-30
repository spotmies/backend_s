const express = require("express");
const router = express.Router();
const complaintDB = require("../../models/partner/complaints_sch");
const partnerDB = require("../../models/partner/partner_registration_sch");
const constants = require("../../helpers/constants");

/* -------------------------------------------------------------------------- */
/*                         RAISE COMPLAINT ON PARTNER                         */
/* -------------------------------------------------------------------------- */
router.post("/", function (req, res, next) {
  const data = req.body;
  console.log("NEW COMPLAINT");
  try {
    complaintDB
      .create(data)
      .then((doc, err) => {
        if (err) {
          console.log(err);

          return res.status(400).send(err.message);
        }
        if (!doc) return res.status(404).json(doc);
        console.log(doc.id);
        try {
          partnerDB.findOneAndUpdate(
            { pId: data.pId },
            { $push: { complaints: doc.id } },
            { new: true },
            (err, doc) => {
              if (err) return res.status(400).send(err.message);
              if (doc == null) return res.status(400).send("invalid pid");
              else return res.status(200).json(doc);
            }
          );
        } catch (error) {
          return res
            .status(400)
            .send("unable to add complaint on partner records");
        }

        // return res.status(200).json(doc);
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

module.exports = router;
