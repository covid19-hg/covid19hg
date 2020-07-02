const throttle = require("lodash/throttle");
const unthrottledFetchAdditionalContributorsData = require("./fetchAdditionalContributorsData");

const fetchAdditionalContributorsData = throttle(
  unthrottledFetchAdditionalContributorsData,
  5000
);

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
    const contributors = await fetchAdditionalContributorsData();
    return {
      statusCode: 200,
      headers: { "Cache-Control": "public, max-age=300" },
      body: JSON.stringify({
        data: contributors,
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
