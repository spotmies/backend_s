const Router = require("express");
const {
  catchFunc,
  processRequest,
} = require("../../helpers/error_handling/process_request");
const router = Router();
const adminDB = require("../../models/admin/admin_schema");

/* ----------------------- POST REQUEST FOR NEW ADMIN ----------------------- */

router.post("/create-admin-master", (req, res) => {
  const body = req.body;
  //create access function here

  try {
    adminDB.create(body, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* ----------------------------- GET ADMINS LIST ---------------------------- */

router.get("/get-all-admins", (req, res) => {
  const params = req.query;
  const isDeleted = params.isDeleted ?? false;
  try {
    adminDB.find({ isDeleted: isDeleted }, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* ----------------------------- ADMIN LOGIN API or ADMIN DETAILS UPDATE ---------------------------- */

router.put("/admin-login/:Id", (req, res) => {
  const body = req.body;
  const id = req.params.Id;
  try {
    adminDB.findOneAndUpdate(
      { adminId: id },
      { $set: body },
      { new: true },
      (err, data) => {
        if (err) {
          return res.status(400).json(err.message);
        }
        if (!data || data.isDeleted == true) {
          return res.status(404).json("Admin not found");
        }
        adminDB.findOneAndUpdate(
          { adminId: id },
          { $push: { logs: body.lastLogin } }
        );
        return res.status(200).json(data);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* --------------------------- UPDATE ADMIN BY ID --------------------------- */

router.put("/admins/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  try {
    adminDB.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* ------------------------- SET PASSWORD FOR ADMIN ------------------------- */

router.post("/admin/set-password/:id", (req, res) => {
  const body = req.body;
  const id = req.params.id;
  try {
    //need to create hash function here
    //and check with the hash function
  } catch (error) {
    return catchFunc(error, res);
  }
});

module.exports = router;
