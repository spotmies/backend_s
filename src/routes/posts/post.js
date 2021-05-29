const express = require("express");
const postDB = require("../../models/posts/posts_sch");
const router = express.Router();

router.post("/newPost", (req, res) => {
  const data = req.body;
  try {
    postDB
      .create(data)
      .then((doc, err) => {
        if (err) {
          return res.status(400).send(err.message);
        }
        if (!doc) return res.status(404).json(doc);
        return res.status(200).json(doc);
      })
      .catch((err) => {
        if (err) {
          return res.status(400).send(err.message);
        }
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
