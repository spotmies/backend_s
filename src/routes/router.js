const express = require("express");
const router = express.Router();
const feedB = require("./feedBack/feedBack");
const userR = require("./users/userR");
const orderR = require("./orders/creat_service");

router.use("/feed", feedB);
router.use("/user", userR);
router.use("/order", orderR);

module.exports = router;
