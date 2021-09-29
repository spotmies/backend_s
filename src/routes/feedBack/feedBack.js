const express = require("express");
const mongoose = require("mongoose");
const feedback = require("../../models/feedBack/feedback");
const router = express.Router();
const admin = require("firebase-admin");
var firebaseFcm = require("../firebase_admin/firebase_admin");
var FCM = require("fcm-node");
const fetch = require("node-fetch");
var serverKey =
  "AAAAQICO0kA:APA91bFHSnH18KNDFn9_l5Antv3uJRMoa3kBZZf-MXncYMrGEUlW8ehKAsUEH2mPyeV9r_28_gLkYk3wIx4fqYzza10DdF87PkAhfpG0LHh-oYUqZcK9_mHkfaxF5NPpmnjCGI1Q0rlD"; //put your server key here
const deviceId =
  "fFu0Kb0wQvuHpJAILzX1fN:APA91bEwtMrSOuiKOkh2YJGqe_l5IJMj0A6PhsAH1AeFnfRl2Kyw9ikxkO0hSDmqbhSynaSAODHdxi97vgNys53ZZBdQoacTzZQHNfe9DU94Jp9Q5013XcM_x1_5GTbnZuwnRhGw2tuS";
const deviceId2 =
  "eWkjKtSFSyiLoGdVYmvn9v:APA91bEgIqMokCxtHksO1_sgmqD34TLl6RuxoxOIA5SI4MKQUWOt2TL-6bjDtw1yCUKWiRcMKtqRss41H6AguT85O6xQnJYS_R4sLFitK57ZxB15PEBq57JwohMI1o5HPv2S83_dAy5R";


  
router.post("/notification4", function (req, res) {
  console.log("nofication 4");
  var notification = {
    title: "titile of notification",
    text: "subtitle",
    body: '{"Message from node js app"}',
  };
  var fcm_token = [deviceId];
  var notification_body = {
    notification: notification,
    registration_ids: fcm_token,
  };
  fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",
    headers: {
      Authorization: "key=" + serverKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(notification_body),
  })
    .then(() => {
      res.status(200).send("notification send success");
    })
    .catch((err) => {
      res.status(400).send("went wrong");
      console.log(err);
    });
});

router.post("/notification3", function (req, res) {
  firebaseFcm.sendNotification(req.body.message);
  res.status(200).send("send");
});

router.post("/notifcation2", function (req, res) {
  const options = {
    method: "POST",
    uri: "https://fcm.googleapis.com/fcm/send",
    headers: {
      Authorization: "key=" + serverKey,
    },
    body: {
      to: deviceId,
      data: {
        subject: "message",
      },
      notification: {
        title: "title",
        body: '{"Message from node js app"}',
        badge: 1,
      },
    },
    json: true,
  };

  return rqstProm(options)
    .then((parsedBody) => {
      console.log("SUCCESS response=", parsedBody);
    })
    .catch((err) => {
      console.log("FAILED err=", err);
    });
});
router.post("/notification", async (req, res, next) => {
  try {
    let fcm = new FCM(serverKey);
    console.log("notification apis ...");
    var message = {
      to: deviceId,
      notification: {
        title: "NotifcatioTestAPP",
        subtitle: "body",
        body: req.body.message,
      },

      // data: {
      //   //you can send only notification or only data(or include both)
      //   title: "ok cdfsdsdfsd",
      //   body: '{"name" : "okg ooggle ogrlrl","product_id" : "123","final_price" : "0.00035"}',
      // },
    };

    fcm.send(message, function (err, response) {
      if (err) {
        console.log("Something has gone wrong!" + err);
        console.log("Respponse:! " + response);
        res.status(400).json(response);
        next(err);
      } else {
        // showToast("Successfully sent with response");
        console.log("Successfully sent with response: ", response);
        res.status(200).json(response);
      }
      //
    });
  } catch (error) {
    next(error);
    res.status(500).send(error);
  }
});
/* -------------------------------------------------------------------------- */
/*             feedback  contactus  partner pre registraion                   */
/* -------------------------------------------------------------------------- */
router.post("/:id", (req, res, next) => {
  const docId = req.params.id;
  console.log("Got body:", req.body);

  const userUpdate = {
    lastModified: new Date(),
    $push: { body: req.body.body },
  };

  try {
    feedback.findOneAndUpdate(
      { docId: docId },
      userUpdate,
      { new: true },
      (err, data) => {
        if (err) {
          console.log("err", err);
          return res.status(400).send("unable to save data");
        } else {
          console.log("data");
          if (data != null) return res.status(200).send("saved");
          else {
            return res.status(400).send("not saved");
          }
        }
      }
    );
  } catch (error) {
    console.log("cathc", error);
    next({ status: 500, message: error });
  }
});

//get data by docid ex: partnerregistraiton,contactus,feedback
router.get("/:id", (req, res) => {
  try {
    feedback.findOne({ docId: req.params.id }, (err, data) => {
      if (err) {
        console.error(err);
        res.status(400).send("unable to load data");
      }
      res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).send("bad req");
  }
});

//get all documents inside feedback collection
router.get("/", (req, res) => {
  try {
    feedback.find({}, (err, data) => {
      if (err) {
        console.error(err);
        res.status(400).send("unable to load data");
      }
      res.status(200).json(data);
    });
  } catch (error) {
    res.status(500).send("bad req");
  }
});

module.exports = router;
