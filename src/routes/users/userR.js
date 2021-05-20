const express = require("express");
const mongoose = require("mongoose");
const userDb = require("../../models/users/userSch");
const router = express.Router();

//post method for registering user
router.post("/newUser", (req, res, next) => {
  console.log("newUser");
  const data = req.body;
  console.log("from api", data);
  try {
    userDb
      .create(data)
      .then((doc, err) => {
        console.log("error", err);
        console.log("data", doc);
        if (err) {
          return res.status(400).send(err.message);
        }
        if (!doc) return res.status(404).json(doc);
        return res.status(200).json(doc);
      })
      .catch((err) => {
        console.log("err", err);
        if (err) {
          return res.status(400).send(err.message);
        }
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//get only user with uId
router.get("/users/:id", (req, res) => {
  const uId = req.params.id;
  try {
    userDb.findOne({ uId: uId }, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(400).send(err.message);
      }
      if (!data) return res.status(404).json(data);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//update user details with put method
router.put("/users/:id", (req, res) => {
  const uId = req.params.id;
  const body = req.body;
  try {
    userDb.findOneAndUpdate({ uId: uId }, body, { new: true }, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(400).send(err.message);
      }
      if (!data) return res.status(404).json(data);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

//get all user
router.get("/users", (req, res) => {
  try {
    userDb.find({}, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(400).send(err.message);
      }
      res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
