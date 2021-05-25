const express = require("express");
const url = require("url");
const querystring = require("querystring");
const router = express.Router();
const chatDB = require("../../models/messaging/messaging_sch");
const constants = require("../../helpers/constants");

/* -------------------------------------------------------------------------- */
/*                            CREATE NEW CHAT ROOM                            */
/* -------------------------------------------------------------------------- */
router.post(`/${constants.newChat}`, (req, res, next) => {
  const data = req.body;
  try {
    chatDB
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

/* -------------------------------------------------------------------------- */
/*                             GET CHAT BY CHAT ID                            */
/* -------------------------------------------------------------------------- */
router.get(`/${constants.chats}/:ID`, (req, res) => {
  const ID = req.params.ID;
  let rawUrl = req.originalUrl;
  console.log("38", req.originalUrl);
  let parsedUrl = url.parse(rawUrl);
  console.log("39", parsedUrl);
  let parsedQs = querystring.parse(parsedUrl.query);
  console.log("41", parsedQs.cBuild);
  let cBuild = parsedQs.cBuild ?? 0;
  try {
    chatDB.findOne({ msgId: ID, cBuild: cBuild }, (err, data) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      if (!data) return res.status(404).json(data);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                           GET ALL CHATLIST BY UID                          */
/* -------------------------------------------------------------------------- */
router.get(`/${constants.user}/:uId/`, (req, res) => {
  const uId = req.params.uId;
  try {
    chatDB.find({ uId: uId }, (err, data) => {
      if (err) {
        return res.status(400).send(err.message);
      }

      if (!data || data == null || data == "")
        return res.status(404).json(data);

      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                           GET ALL CHATLIST BY PID                          */
/* -------------------------------------------------------------------------- */
router.get(`/${constants.partner}/:uId`, (req, res) => {
  const uId = req.params.uId;
  try {
    chatDB.find({ pId: uId }, (err, data) => {
      if (err) {
        return res.status(400).send(err.message);
      }
      if (!data || data == null || data == "")
        return res.status(404).json(data);
      return res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                              GET ALL CHATLIST                              */
/* -------------------------------------------------------------------------- */
router.get(`/${constants.chats}`, (req, res) => {
  try {
    chatDB.find({}, (err, data) => {
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

/* -------------------------------------------------------------------------- */
/*                                 UPDATE CHAT                                */
/* -------------------------------------------------------------------------- */
router.put(`/${constants.chats}/:msgId`, (req, res, next) => {
  const msgId = req.params.msgId;
  const body = req.body;
  try {
    chatDB.findOneAndUpdate(
      { msgId: msgId },
      body,
      { new: true },
      (err, data) => {
        if (err) {
          //console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data) return res.status(404).json(data);
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                                 DELETE CHAT                                */
/* -------------------------------------------------------------------------- */
router.delete(`/${constants.chats}/:msgId`, (req, res) => {
  //console.log("deleting");
  const msgId = req.params.msgId;
  try {
    chatDB.findOneAndRemove({ msgId: msgId }, (err) => {
      if (err) {
        //console.error(err);
        return res.status(400).send(err.message);
      } else {
        chatDB.findOne({ msgId: msgId }, (err, doc) => {
          if (!doc) {
            //console.log("deleted");
            return res.status(200).send("doc deleted");
          } else return res.status(400).send("not deleted");
        });
      }
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
module.exports = router;
