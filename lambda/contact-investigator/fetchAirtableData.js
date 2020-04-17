const Airtable = require("airtable");
const parseEmailField = require("./parseEmailField");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base("appVc6kMY1ZNr0uv5");
module.exports = async () => {
  const partnersPromise = new Promise((resolve, reject) => {
    let data = [];
    base("Submission")
      .select({ view: "Partners Page" })
      .eachPage(
        (records, fetchNextPage) => {
          const recordFields = records.map(({ fields, id }) => {
            return {
              emails: parseEmailField(fields["Email"]),
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
  const emailOptOutPromise = new Promise((resolve, reject) => {
    let data = [];
    base("Email opt out")
      .select({ view: "Grid view" })
      .eachPage(
        (records, fetchNextPage) => {
          const recordFields = records
            .map(({ fields }) => fields["Email"])
            .filter((elem) => elem !== undefined);
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
  const [partnersData, emailOptOutData] = await Promise.all([
    partnersPromise,
    emailOptOutPromise,
  ]);
  const mergedData = partnersData.map(({ emails, id }) => {
    const notOpedOutEmails = emails.filter(
      (elem) => emailOptOutData.includes(elem) === false
    );
    // Remove studies whose investigators have all opted out:
    return notOpedOutEmails.length === 0
      ? undefined
      : {
          emails: notOpedOutEmails,
          id,
        };
  });
  const filteredData = mergedData.filter((elem) => elem !== undefined);
  return filteredData;
};
