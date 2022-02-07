const express = require("express");
const jwt = require("jsonwebtoken");
const userDb = require("../../models/users/userSch");
const router = express.Router();
const {
  processRequest,
  catchFunc,
  processRequestNext,
} = require("../../helpers/error_handling/process_request");

/* -------------------------------- Login api ------------------------------- */

router.post("/user/login", (req, res) => {
  const body = req.body;
  // Mock user
  const user = {
    uId: body.uId,
  };

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
        // processRequest(err, data, res, req, );
        processRequestNext(err, data, res, req, () => {
          jwt.sign(
            { user },
            "secretkey",
            { expiresIn: "30s" },
            (err, token) => {
              if (err) {
                return res.status(400).send(err.message);
              }
              return res.json({
                token,
              });
            }
          );
        });
      }
    );
  } catch (error) {
    return catchFunc(error, res, req);
  }
});

/* ---------------------------- GET ACCESS TOKEN ---------------------------- */

router.post("/access-token", (req, res) => {
  const body = req.body;
  const user = {
    uId: body.uId,
  };
  try {
    userDb.findOne({ uId: body.uId }, (err, data) => {
      processRequestNext(err, data, res, req, () => {
        jwt.sign({ user }, "secretkey", { expiresIn: "30s" }, (err, token) => {
          if (err) {
            return res.status(400).send(err.message);
          }
          return res.json({
            token,
          });
        });
      });
    });
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

module.exports = router;
