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
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ------------------------------- Get all faq ------------------------------ */

router.get("/all-faqs", (req, res) => {
  const isDeleted = req.query.isDeleted ?? false;
  const isActive = req.query.isActive ?? true;
  try {
    db.find({ isDeleted: isDeleted, isActive: isActive }, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ------------------------------ Get faq by id ----------------------------- */

router.get("/faqs/:id", (req, res) => {
  const id = req.params.id;
  try {
    db.findById(id, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ---------------------------- Update faq by id ---------------------------- */

router.put("/faqs/:id", (req, res) => {
  const id = req.params.id;
  let body = req.body;
  body.lastModified = body.lastModified ?? new Date().valueOf();
  try {
    //set only few fields
    db.findByIdAndUpdate(id, { $set: body }, { new: true }, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ------------------------- Delete question from faq ------------------------ */

router.delete("/question-to-faq/:id", (req, res) => {
  const id = req.params.id;
  const questionId = req.body.id;
  try {
    db.findByIdAndUpdate(
      id,
      { $pull: { body: { _id: questionId } } },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ------------------------ Add new questions to faq ------------------------ */

router.put("/question-to-faq/:id", (req, res) => {
  const id = req.params.id;
  let body = req.body;
  body.lastModified = body.lastModified ?? new Date().valueOf();
  const payLoad = body.payLoad;

  try {
    db.findByIdAndUpdate(
      id,
      { $push: { body: payLoad }, $set: { lastModified: body.lastModified } },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ----------------------- Update object inside a FAQ ----------------------- */

//need to work on this one
router.put("/update-question-in-faq/:id/:objId", (req, res) => {
  const id = req.params.id;
  const objId = req.params.objId;
  let body = req.body;
  body.lastModified = body.lastModified ?? new Date().valueOf();
  db.findById(id, (err, data) => {
    //   if(err){
    //       return processRequest(err,data,res);
    //       }
    if (data) {
      //data.body.indexOf(objId).body = body;
      data.body.forEach((element) => {
        if (element._id == objId) {
          element = body;
        }
      });
      data.save((err, data) => {
        return processRequest(err, data, res, req);
      });
    }
  });
});

/* ---------------------------- Delete faq by id ---------------------------- */

router.delete("/faqs/:id", (req, res) => {
  const id = req.params.id;
  try {
    db.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res, req);
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

module.exports = router;
