/* eslint-disable */
const Airtable = require("airtable")
const throttle = require("lodash/throttle")

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY
});
const base = Airtable.base("appVc6kMY1ZNr0uv5");

const unthrottledFetchData = () => {
  console.log("begin fetch from Airtable API");
  let data = [];
  return new Promise((resolve, reject) => {
    base("Submission")
      .select()
      .eachPage(
        (records, fetchNextPage) => {
          const fields = records.map(
            ({
              fields: { Study, Investigator, Affiliation, City, Country }
            }) => ({ Study, Investigator, Affiliation, City, Country })
          );
          data = [...data, ...fields];
          fetchNextPage();
        },
        err => {
          if (err) {
            console.error(err);
            reject(err)
          }
          console.log("end fetch from Airtable API with", data.length, "records");
          resolve(data)
        }
      );
  })
};

const fetchData = throttle(unthrottledFetchData, 2000);

exports.handler = async function(event, context) {
  try {
    const data = await fetchData();
    return {
      statusCode: 200,
      body: JSON.stringify({ data })
    };
  } catch (err) {
    console.log(err); // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    };
  }
};
