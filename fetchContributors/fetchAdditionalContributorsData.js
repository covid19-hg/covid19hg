/* eslint-env node */
const Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base("appVc6kMY1ZNr0uv5");
module.exports = async () => {
  const partnersPromise = new Promise((resolve, reject) => {
    let data = [];
    base("Additional contributors")
      .select({ view: "Grid view" })
      .eachPage(
        (records, fetchNextPage) => {
          const recordFields = records.map(({ fields, id }) => {
            return {
              contributor: fields["Contributor"],
              role: fields["Role"],
              studyIds: fields["Study"],
              adhocGroup: fields["AdhocGroup"],
              affiliation: fields["Affiliation"],
              affiliationLink: fields["affililationLink"],
              id,
            };
          });
          data = [...data, ...recordFields];
          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error(err);
            reject(err);
          } else {
            resolve(data);
          }
        }
      );
  });
  return partnersPromise;
};
