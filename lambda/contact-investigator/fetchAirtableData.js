const Airtable = require("airtable");
const parseEmailField = require("./parseEmailField")

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base("appVc6kMY1ZNr0uv5");
module.exports = async () => {
  let data = [];
  return new Promise((resolve, reject) => {
    base("Submission")
      .select({ view: "Submission Data" })
      .eachPage(
        (records, fetchNextPage) => {
          const unfilteredRecordFields = records.map(({ fields, id }) => {
            const emailParseResult = parseEmailField(fields["Email"], fields["Website contact opt out"])
            if (emailParseResult.isEmailAvailable === true) {
              return {
                id,
                emails: emailParseResult.emails,
              };
            } else {
              return undefined
            }
          });
          const recordFields = unfilteredRecordFields.filter(elem => elem !== undefined)
          data = [...data, ...recordFields];
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          console.log(
            "Successfully fetch from Airtable API with",
            data.length,
            "records"
          );
          resolve(data);
        }
      );
  });
};
