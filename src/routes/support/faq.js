const express = require("express");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");
const db = require("../../models/support/faq_schema");
const router = express.Router();

/* ----------------------------- Create new faq ----------------------------- */

router.post("/new-faq", (req, res) => {
  const body = req.body;
  try {
    db.create(body, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* ------------------------------- Get all faq ------------------------------ */

router.get("/all-faqs", (req, res) => {
    const isDeleted = req.query.isDeleted ?? false;
    const isActive = req.query.isActive ?? true;
    try {
        db.find(
            { isDeleted: isDeleted, isActive: isActive },
            (err, data) => {
                return processRequest(err, data, res);
            }
        );
    } catch (error) {
        return catchFunc(error, res);
    }
});

/* ------------------------------ Get faq by id ----------------------------- */

router.get("/faqs/:id", (req, res) => {
    const id = req.params.id;
    try {
        db.findById(id, (err, data) => {
            return processRequest(err, data, res);
        });
    } catch (error) {
        return catchFunc(error, res);
    }
});

/* ---------------------------- Update faq by id ---------------------------- */

router.put("/faqs/:id", (req, res) => {
    const id = req.params.id;
    let body = req.body;
    body.lastModified = body.lastModified ?? new Date().valueOf();
    try {
        //set only few fields
        db.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true },
            (err, data) => {
                return processRequest(err, data, res);
            }
        );
    } catch (error) {
        return catchFunc(error, res);
    }
});

/* ------------------------- Add new question to faq ------------------------ */
router.put("/")

/* ---------------------------- Delete faq by id ---------------------------- */
router.delete("/faqs/:id", (req, res) => {
    const id = req.params.id;
    try {
        db.findByIdAndUpdate(
            id,
            { $set: { isDeleted: true } },
            { new: true },
            (err, data) => {
                return processRequest(err, data, res);
            }
        );
    } catch (error) {
        return catchFunc(error, res);
    }
});



module.exports = router;
