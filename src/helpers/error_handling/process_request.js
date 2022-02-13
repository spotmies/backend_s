const { saveError } = require("../../services/errors");

function processRequest(err, data, res, req, { noContent = false } = {}) {
  if (err) {
    //saveError(err.message, req.originalUrl, req.method);
    return res.status(400).json(err.message);
  }
  if (!data || data?.isDeleted == true)
    return res.status(404).json({ message: "No data found" });
  if (noContent) return res.sendStatus(204);
  return res.status(200).json(data);
}
function deleteRequest(err, data, res) {
  if (err) {
    //saveError(err.message, req.originalUrl, req.method);
    return res.status(400).json(err.message);
  }

  if (!data) return res.status(404).json({ message: "No data found" });
  if (data?.isDeleted) return res.sendStatus(204);
  else return res.sendStatus(500);
}
function catchFunc(error, res, req) {
  //saveError(err.message, req.originalUrl, req.method);
  return res.status(500).json({
    message: "Internal Server Error",
    error: error.message,
  });
}

function processRequestNext(err, data, res, req, next, onNoData) {
  if (err) {
    //saveError(err.message, req.originalUrl, req.method);
    return res.status(400).json(err.message);
  }
  if (!data || data?.isDeleted == true) {
    if (onNoData != undefined || onNoData != null) {
      return onNoData();
    }
    return res.status(404).json({ message: "No data found" });
  }
  // return res.status(200).json(data);
  next();
}

module.exports = {
  processRequest,
  deleteRequest,
  catchFunc,
  processRequestNext,
};
