const express = require("express");
const router = express.Router();
const db = require("../models/errors/errors_schema");

//create named arugment function

function saveError(error, api, method, { body = null, type = null } = {}) {
  let newBody = {
    error: error,
    api: api,
    method: method,
  };
  if (body != null) {
    newBody.errorBody = body;
  }
  if (type != null) {
    newBody.errorType = type;
  }

  try {
    db.create(newBody, (err, data) => {
    });
  } catch (error) {}
}

module.exports = {
  saveError,
};
