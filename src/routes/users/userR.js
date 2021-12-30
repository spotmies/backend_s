const express = require("express");
const userDb = require("../../models/users/userSch");
const router = express.Router();
const constants = require("../../helpers/constants");
const {
  processRequest,
  catchFunc,
} = require("../../helpers/error_handling/process_request");
//post method for registering user
/* -------------------------------------------------------------------------- */
/*                                   new user registration                                  */
/* -------------------------------------------------------------------------- */
router.post("/newUser", (req, res, next) => {
  //console.log("newUser");
  const data = req.body;
  console.log("from api", data);
  try {
    userDb
      .init()
      .then(async () => {
        const user = new userDb(data);
        const result = await user.save();
        res.json(result);
      })
      .catch((err) => {
        //console.log("err", err);
        if (err) {
          return res.status(400).send(err.message);
        }
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                               get user by uId                              */
/* -------------------------------------------------------------------------- */
//get only user with uId
router.get(`/${constants.userDetails}/:id`, (req, res) => {
  const uId = req.params.id;
  try {
    userDb
      .findOne({ uId: uId })
      .populate({ path: "orders", match: { isDeletedForUser: false } })
      .exec(function (err, data) {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        return res.status(200).json(data);
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------- Login api ------------------------------- */

router.post("/login", (req, res) => {
  const body = req.body;
  try {
    userDb.findOneAndUpdate(
      { uId: body.uId },
      {
        $push: { logs: body.lastLogin },
        userDeviceToken: body.userDeviceToken,
        isActive: body.isActive ?? true,
      },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res, req, { noContent: true });
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ------------------------------- Logout api ------------------------------- */

router.post("/logout", (req, res) => {
  const uId = req.body.uId;
  try {
    userDb.findOneAndUpdate(
      { uId: uId },
      { $set: { isActive: false } },
      (err, doc) => {
        return processRequest(err, doc, res, req, { noContent: true });
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* -------------------------------------------------------------------------- */
/*                             update user details                            */
/* -------------------------------------------------------------------------- */
//update user details with put method
router.put("/users/:id", (req, res) => {
  const uId = req.params.id;
  const body = req.body;

  try {
    userDb.findOneAndUpdate(
      { uId: uId },
      { $set: body },
      { new: true },
      (err, data) => {
        if (err) {
          console.error(err);
          return res.status(400).send(err.message);
        }
        if (!data) return res.status(404).json(data);
        if (body.lastLogin) {
          try {
            userDb.findOneAndUpdate(
              { uId: uId },
              { $push: { logs: body.lastLogin } },
              { new: true },
              (err, doc) => {}
            );
          } catch (error) {
            //console.log("79", error);
          }
        }
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                             delete user by uIdṣ                            */
/* -------------------------------------------------------------------------- */
//delete particular user with uId
router.delete("/users/:id", (req, res) => {
  //console.log("deleting");
  const uId = req.params.id;
  try {
    userDb.findOneAndRemove({ uId: uId }, (err) => {
      if (err) {
        //console.error(err);
        return res.status(400).send(err.message);
      } else {
        userDb.findOne({ uId: uId }, (err, doc) => {
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

/* -------------------------------------------------------------------------- */
/*                                get all users                               */
/* -------------------------------------------------------------------------- */
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

router.get("/testing", (req, res) => {
  console.log(req);
  try {
    return res.status(200).json({
      message: "testing",
      api: req.originalUrl,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

module.exports = router;
