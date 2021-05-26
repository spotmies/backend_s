const url = require("url");
const querystring = require("querystring");

function parseParams(rawUrl) {
  let parsedUrl = url.parse(rawUrl);
  let parsedQs = querystring.parse(parsedUrl.query);
  return parsedQs;
}
module.exports = { parseParams };
