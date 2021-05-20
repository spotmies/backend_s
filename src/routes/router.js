const express = require("express");
const router = express.Router();
const feedB = require("./feedBack/feedBack");

router.use("/feed", feedB);

module.exports = router;
