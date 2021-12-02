const Router = require("express");
const router = Router();
const constantsSchema = require("../../models/constants/constants_schema");
const { parseParams } = require("../../helpers/query/parse_params");
const {
  catchFunc,
  processRequest,
} = require("../../helpers/error_handling/process_request");

/* -------------------------------------------------------------------------- */
/*                             NEW CONSTANTS ROUTES                            */
/* -------------------------------------------------------------------------- */

router.post("/new-constants", (req, res) => {
  try {
    constantsSchema.create(req.body, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------------------------------------------------------- */
/*                           GET  MOBILE CONSTANTS  by id                        */
/* -------------------------------------------------------------------------- */
router.get("/constants/:id", (req, res) => {
  let id = req.params.id;
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;

  try {
    constantsSchema.findOne({ _id: id, isDeleted: isDeleted }, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------------------------------------------------------- */
/*                           GET CONSTANTS BY DOC ID                           */
/* -------------------------------------------------------------------------- */
router.get("/doc-id/:docId", (req, res) => {
  let docId = req.params.docId;
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    constantsSchema.findOne(
      { docId: docId, isDeleted: isDeleted },
      (err, data) => {
        return processRequest(err, data, res);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------------------------------------------------------- */
/*                              GET ALL CONSTANTS                              */
/* -------------------------------------------------------------------------- */
router.get("/all-constants", (req, res) => {
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    constantsSchema.find({ isDeleted: isDeleted }, (err, data) => {
      return processRequest(err, data, res);
    });
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------------------------------------------------------- */
/*                    ADD NEW CONSTANTS TO PARTICULAR SCREEN                   */
/* -------------------------------------------------------------------------- */
router.post("/constants-to-screen/:id", (req, res) => {
  let id = req.params.id;
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;
  let updateBody = req.body.payload;
  let screenName = req.body.screenName;
  try {
    constantsSchema.findOneAndUpdate(
      { _id: id, isDeleted: isDeleted },
      { $addToSet: { [screenName]: { $each: [updateBody] } } },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------------------------------------------------------- */
/*                 ADD OR UPDATE CONSTANTS TO PARTICULAR SCREEN                */
/* -------------------------------------------------------------------------- */

router.put("/constants-to-screen/:id", (req, res) => {
  let id = req.params.id;
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;
  let updateBody = req.body.payload;
  let screenName = req.body.screenName;
  let objId = req.body.payload.objId;
  try {
    constantsSchema.findOneAndUpdate(
      { _id: id, isDeleted: isDeleted },
      { $pull: { [screenName]: { objId: objId } } },
      { new: true },
      (err, data) => {
        if (err) return res.status(400).json(err.message);
        if (!data) return res.status(404).json("No data found");
        constantsSchema.findOneAndUpdate(
          { _id: id, isDeleted: isDeleted },
          { $push: { [screenName]: updateBody },$set:{lastModified:Date.now().toString()} },
          { new: true },
          (err, data) => {
            return processRequest(err, data, res);
          }
        );
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------------------------------------------------------- */
/*                   REMOVE CONSTANTS FROM PARTICULAR SCREEN                   */
/* -------------------------------------------------------------------------- */
router.delete("/constants-to-screen/:id", (req, res) => {
  let id = req.params.id;
  let originalUrl = parseParams(req.originalUrl);
  let isDeleted = originalUrl.isDeleted ?? false;
  let screenName = req.body.screenName;
  let objId = req.body.objId;
  try {
    constantsSchema.findOneAndUpdate(
      { _id: id, isDeleted: isDeleted },
      { $pull: { [screenName]: { objId: objId } },$set:{lastModified:Date.now().toString()} },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------------------------------------------------------- */
/*                               UPDATE CONSTANTS                              */
/* -------------------------------------------------------------------------- */
router.put("/constants/:id", (req, res) => {
  let originalUrl = parseParams(req.originalUrl);

  let isDeleted = originalUrl.isDeleted ?? false;
  try {
    constantsSchema.findByIdAndUpdate(
      { _id: req.params.id, isDeleted: isDeleted },
      { $set: req.body },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

/* -------------------------------------------------------------------------- */
/*                            DELETE CONSTANTS BY ID                           */
/* -------------------------------------------------------------------------- */
router.delete("/constants/:id", (req, res) => {
  try {
    constantsSchema.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { isDeleted: true } },
      { new: true },
      (err, data) => {
        return processRequest(err, data, res);
      }
    );
  } catch (error) {
    return catchFunc(error, res);
  }
});

module.exports = router;
