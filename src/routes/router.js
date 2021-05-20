const express = require("express");
const router = express.Router();
const feedB = require("./feedBack/feedBack");
const userR = require("./users/userR");

router.use("/feed", feedB);
router.use("/user", userR);

module.exports = router;
