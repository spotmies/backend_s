const { parseParams } = require("../../helpers/query/parse_params");

const express = require("express");
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
        return getChatById(res,doc.msgId);
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
function getChatById(res,msgId){
  try {
    chatDB
      .findOne({ msgId: msgId})     
      .populate("orderDetails")
      .populate("uDetails")
      .populate(
        "pDetails",
        "name eMail phNum partnerPic rate lang experience job loc businessName accountType availability"
      )
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data || data == null || data == "")
          return res.status(501).json(data);
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

router.get(`/${constants.chats}/:ID`, (req, res) => {
  const ID = req.params.ID;
  let sekhar = parseParams(req.originalUrl);
  let param1;
  let cBuild;
  if (sekhar.cBuild != null) {
    cBuild = sekhar.cBuild;
    param1 = "cBuild";
  } else {
    param1 = "msgId";
    cBuild = ID;
  }
  try {
    chatDB.findOne({ msgId: ID, [param1]: cBuild }, (err, data) => {
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
/*                           GET ALL CHATLIST BY UID & PID                    */
/* -------------------------------------------------------------------------- */
router.get(`/:userType/:uId`, (req, res) => {
  const uId = req.params.uId;
  const userType =
    req.params.userType == constants.user
      ? "uId"
      : req.params.userType == constants.partner
      ? "pId"
      : null;
  console.log(userType, uId);
  let sekhar = parseParams(req.originalUrl);
  let param1;
  let cBuild;
  if (sekhar.cBuild != null) {
    cBuild = sekhar.cBuild;
    param1 = "cBuild";
  } else {
    param1 = userType;
    cBuild = uId;
  }

  try {
    chatDB
      .find({ [userType]: uId, [param1]: cBuild })
      .sort({ lastModified: -1 })
      .populate("orderDetails")
      .populate("uDetails")
      .populate(
        "pDetails",
        "name eMail phNum partnerPic rate lang experience job loc businessName accountType availability"
      )
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data || data == null || data == "")
          return res.status(501).json(data);
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                           GET ALL CHATLIST BY PID                          */
/* -------------------------------------------------------------------------- */
// router.get(`/${constants.partner}/:uId`, (req, res) => {
//   const uId = req.params.uId;
//   try {
//     chatDB.find({ pId: uId }, (err, data) => {
//       if (err) {
//         return res.status(400).send(err.message);
//       }
//       if (!data || data == null || data == "")
//         return res.status(404).json(data);
//       return res.status(200).json(data);
//     });
//   } catch (error) {
//     return res.status(500).send(error.message);
//   }
// });

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
            return res.status(204).send();
          } else return res.status(400).send("not deleted");
        });
      }
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
module.exports = router;
