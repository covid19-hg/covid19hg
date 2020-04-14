/* eslint-disable */
const throttle = require("lodash/throttle");
const unthrottledFetchAirtableData = require("./fetchAirtableData")

const fetchData = throttle(unthrottledFetchAirtableData, 5000);

exports.handler = async function(event, context) {
  try {
    const data = await fetchData();
    return {
      statusCode: 200,
      headers: { "Cache-Control": "public, maxage=5" },
      body: JSON.stringify({ data }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }),
    };
  }
};
