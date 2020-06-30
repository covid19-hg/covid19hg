const throttle = require("lodash/throttle");
const unthrottledFetchAdditionalContributorsData = require("./fetchAdditionalContributorsData");
const unthrottledFetchPartnersData = require("../partners/fetchPartnersData");

const fetchAdditionalContributorsData = throttle(
  unthrottledFetchAdditionalContributorsData,
  5000
);
const fetchPartnersData = throttle(unthrottledFetchPartnersData, 5000);

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {
    const [contributorsData, partnersData] = await Promise.all([
      fetchAdditionalContributorsData(),
      fetchPartnersData(),
    ]);
    const studies = partnersData.map(({ id, study }) => ({ id, name: study }));
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          contributors: contributorsData,
          studies,
        },
      }),
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};
