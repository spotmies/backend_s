const express = require("express");
const userDb = require("../../models/users/userSch");
const router = express.Router();
//post method for registering user
/* -------------------------------------------------------------------------- */
/*                                   new user registration                                  */
/* -------------------------------------------------------------------------- */
router.post("/newUser", (req, res, next) => {
  //console.log("newUser");
  const data = req.body;
  //console.log("from api", data);
  try {
    userDb
      .create(data)
      .then((doc, err) => {
        //console.log("error", err);
        //console.log("data", doc);
        if (err) {
          return res.status(400).send(err.message);
        }
        if (!doc) return res.status(404).json(doc);
        return res.status(200).json(doc);
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
router.get("/users/:id", (req, res) => {
  const uId = req.params.id;
  try {
    userDb.findOne({ uId: uId }, (err, data) => {
      if (err) {
        //console.error(err);
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
/*                             update user details                            */
/* -------------------------------------------------------------------------- */
//update user details with put method
router.put("/users/:id", (req, res) => {
  const uId = req.params.id;
  const body = req.body;

  try {
    userDb.findOneAndUpdate({ uId: uId }, body, { new: true }, (err, data) => {
      if (err) {
        //console.error(err);
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
    });
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
            return res.status(200).send("doc deleted");
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

module.exports = router;
