var admin = require("firebase-admin");
var serviceAccount = require("./spotmiess-firebase-adminsdk-kckns-252d3ae26a.json");
var androidOptions = {
  notification: {
    sound: "default",
    visibility: "public",
  },
};
var message = {
  notification: {
    title: "Backend started",
    body: "This notification fire whenevener backend restarts or starts",
  },
  data: {
    msgType: "Search",
    word: "Love",
  },
  android: {
    notification: {
      sound: "default",
      visibility: "public",
    },
  },
  apns: {
    payload: {
      aps: {
        sound: "default",
      },
    },
  },
  topic: "spotmiesPartner",
};

// admin
//   .messaging()
//   .send(message)
//   .then((response) => {
//     console.log("Successfully sent message: ", response);
//   })
//   .catch((error) => {
//     console.log("Error sending message: ", error);
//   });
function sendPayload(payload) {
  try {
    admin
      .messaging()
      .send(payload)
      .then((response) => {
        console.log("Successfully sent message: ", response);
      })
      .catch((error) => {
        console.log("Error sending message: ", error);
      });
  } catch (error) {
    console.log("went wrong", error);
  }
}
module.exports = {
  start: function () {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://spotmiess.firebaseio.com",
    });
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message: ", response);
      })
      .catch((error) => {
        console.log("Error sending message: ", error);
      });
  },
  sendNotification: function (message) {
    let payload = {
      notification: {
        title: "spotmies notification",
        body: message,
      },
      android: androidOptions,

      token:
        "fFu0Kb0wQvuHpJAILzX1fN:APA91bEwtMrSOuiKOkh2YJGqe_l5IJMj0A6PhsAH1AeFnfRl2Kyw9ikxkO0hSDmqbhSynaSAODHdxi97vgNys53ZZBdQoacTzZQHNfe9DU94Jp9Q5013XcM_x1_5GTbnZuwnRhGw2tuS",
    };
    sendPayload(payload);
  },
  notificationByToken: function ({ token, title, body } = {}) {
    let payload = {
      notification: {
        title: title,
        body: body,
      },
      android: androidOptions,
      token: token,
    };
    sendPayload(payload);
  },
  notificationByTopic: function ({ topic, title, body } = {}) {
    let payload = {
      notification: {
        title: title,
        body: body,
      },
      android: androidOptions,
      topic: topic,
    };
    sendPayload(payload);
  },
};