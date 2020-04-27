const Airtable = require("airtable");
const parseEmailField = require("../contact-investigator/parseEmailField");

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
          const unfilteredRecordFields = records.map(({ fields, id }) => {
            return {
              study: fields["Study"],
              investigator: fields["Investigator"],
              affiliation: fields["Affiliation"],
              country: fields["Country"],
              city: fields["City"],
              studyLink: fields["Study link"],
              retrospective: fields["Retrospective"],
              prospective: fields["Prospective"],
              retrospectiveSampleSize: fields["Retrospective sample size"],
              prospectiveSampleSize: fields["Prospective sample size"],
              genotyping: fields["Genotyping"],
              wes: fields["WES"],
              wgs: fields["WGS"],
              assaysPlanned: fields["Additional assays planned"],
              otherAssays: fields["Other assays"],
              researchQuestion: fields["Research Question"],
              studyDesign: fields["Study design"],
              researchCategory: fields["Research Category"],
              studyDesignUnformatted: fields["Study design unformatted"],
              timeCreated: Date.parse(fields["Time created"]),
              mapLocation: fields["Map location"],
              emails: parseEmailField(fields["Email"]),
              hasSubmittedData: Array.isArray(fields["Data"]) === true && (fields["Data"].length > 0),
              id,
            };
          });
          const recordFields = unfilteredRecordFields.filter(obj => {
            for (const value of Object.values(obj)) {
              if (value !== undefined) {
                return true
              }
              return false
            }
          })
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
  const finalData = partnersData.map(({ emails, ...rest }) => {
    const notOpedOutEmails = emails.filter(
      (elem) => emailOptOutData.includes(elem) === false
    );
    const shouldShowContactButton = notOpedOutEmails.length > 0;
    return {
      shouldShowContactButton,
      ...rest,
    };
  });
  return finalData;
};
