const express = require("express");
const router = express.Router();
const coursesDB = require("../../models/tutorials/course_schema");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");

/* --------------------------- CREATE A NEW COURSE -------------------------- */

router.post("/new-course", (req, res) => {
  const body = req.body;
  try {
    coursesDB.create(body, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ----------------------- UPDATE DETAILS OF A COURSE ----------------------- */

router.put("/courses/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  try {
    coursesDB.findByIdAndUpdate(id, body, { new: true }, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ---------------------------- GET COURSE BY ID ---------------------------- */

router.get("courses/:id", (req, res) => {
  const id = req.params.id;
  const originalUrl = req.query;
  const isDeleted = originalUrl.isDeleted ?? false;
  try {
    coursesDB.findOne({ _id: id, isDeleted: isDeleted }, (err, data) => {
      return processRequest(err, data, res, req);
    });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* --------------------------- GET ALL COURSES ----------------------------- */

router.get("/all-courses", (req, res) => {
  const originalUrl = req.query;
  const isDeleted = originalUrl.isDeleted ?? false;
  try {
    coursesDB
      .find({ isDeleted: isDeleted })
      .populate("listUnits")
      .exec((err, data) => {
        return processRequest(err, data, res, req);
      });
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ------------------------ PUSH NEW UNITS TO COURSES ----------------------- */

router.put("/units-to-course/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const originalUrl = req.query;
  const remove = originalUrl.remove ?? false;
  try {
    coursesDB.findByIdAndUpdate(
      id,
      {
        $pullAll: { listUnits: body.objectIds },
        $set: { lastModified: Date.now().toString() },
      },
      { new: true },
      (err, data) => {
        if (remove) return processRequest(err, data, res, req);
        coursesDB.findByIdAndUpdate(
          id,
          { $addToSet: { listUnits: body.objectIds } },
          { new: true },
          (err, data) => {
            return processRequest(err, data, res, req);
          }
        );
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

module.exports = router;
