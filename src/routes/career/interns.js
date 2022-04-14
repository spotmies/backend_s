const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const internDB = require("../../models/career/internship_schema");
const { notificationByTopic } = require("../firebase_admin/firebase_admin");

//post request to add new intern
router.post("/new-intern-registration", (req, res) => {
  console.log("new intern registration");
  const body = req.body;
  try {
    internDB.create(body, (err, data) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(200).json(data);
        // notificationByTopic({
        //   topic: "spotmiesPartner",
        //   title: "New Intern Registered",
        //   body: `name: ${data.name} \napplied for: ${data.appliedFor} \nphone: ${data.phone}  `,
        // });
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//put request to update intern
router.put("/interns/:id", (req, res) => {
  const docId = req.params.id;
  const body = req.body;
  try {
    internDB.findByIdAndUpdate(
      docId,
      { $set: body },
      { new: true },
      (err, data) => {
        if (err) {
          res.status(400).send(err.message);
        } else {
          res.status(200).json(data);
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//get request to get all interns
router.get("/interns/all", (req, res) => {
  try {
    internDB.find({ isDeleted: false }, (err, data) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//get request to get intern by id
router.get("/interns/:id", (req, res) => {
  console.log("get intern by id");
  const docId = req.params.id;
  try {
    internDB.findById(docId, { isDeleted: false }, (err, data) => {
      if (err) {
        res.status(400).send(err.message);
      } else {
        res.status(200).json(data);
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

//delete request to delete intern
router.delete("/interns/:id", (req, res) => {
  const docId = req.params.id;
  try {
    internDB.findByIdAndUpdate(
      docId,
      { isDeleted: true },
      { new: true },
      (err, data) => {
        if (err) {
          res.status(400).send(err.message);
        } else {
          res.sendStatus(204);
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
