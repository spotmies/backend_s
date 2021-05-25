const express = require("express");
const router = express.Router();
const orderDB = require("../../models/orders/create_service_sch");
const constants = require("../../helpers/constants");

/* -------------------------------------------------------------------------- */
/*                              create new order                              */
/* -------------------------------------------------------------------------- */
router.post(`/${constants.createOrder}`, (req, res, next) => {
  const data = req.body;
  try {
    orderDB
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
/*                               GET ORDER BY ID                              */
/* -------------------------------------------------------------------------- */

router.get(`/orders/:ordId`, (req, res) => {
  const ordId = req.params.ordId;
  try {
    orderDB.findOne({ ordId: ordId }, (err, data) => {
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
/*                            update or edit order                            */
/* -------------------------------------------------------------------------- */
router.put(`/${constants.orders}/:ordId`, (req, res, next) => {
  const ordId = req.params.ordId;
  const body = req.body;
  try {
    orderDB.findOneAndUpdate(
      { ordId: ordId },
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
/*                             DELETE ORDER BY ID                             */
/* -------------------------------------------------------------------------- */

router.delete(`/${constants.orders}/:ordId`, (req, res) => {
  //console.log("deleting");
  const ordId = req.params.ordId;
  try {
    orderDB.findOneAndRemove({ ordId: ordId }, (err) => {
      if (err) {
        //console.error(err);
        return res.status(400).send(err.message);
      } else {
        orderDB.findOne({ ordId: ordId }, (err, doc) => {
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
/*                               GET ALL ORDERS                               */
/* -------------------------------------------------------------------------- */
router.get(`/${constants.orders}`, (req, res) => {
  try {
    orderDB.find({}, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(400).send(err.message);
      }
      if (!data || data == null || data == "")
        return res.status(404).json(data);

      res.status(200).json(data);
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

/* -------------------------------------------------------------------------- */
/*                             GET ALL USER ORDERS                            */
/* -------------------------------------------------------------------------- */
router.get(`/user/:uId`, (req, res) => {
  const uId = req.params.uId;
  try {
    orderDB.find({ uId: uId }, (err, data) => {
      if (err) {
        //console.error(err);
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

module.exports = router;
