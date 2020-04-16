const Airtable = require("airtable");
const parseEmailField = require("../contact-investigator/parseEmailField");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = Airtable.base("appVc6kMY1ZNr0uv5");
module.exports = async () => {
  let data = [];
  return new Promise((resolve, reject) => {
    base("Submission")
      .select({ view: "Partners Page" })
      .eachPage(
        (records, fetchNextPage) => {
          const recordFields = records.map(({ fields, id }) => {
            const emailParseResult = parseEmailField(fields["Email"], fields["Website contact opt out"])
            const shouldShowContactButton =
              emailParseResult.hasOptedOut === false && emailParseResult.isEmailAvailable === true;
            return {
              shouldShowContactButton,
              investigator: fields["Investigator"],
              retrospective: fields["Retrospective"],
              prospective: fields["Prospective"],
              retrospectiveSampleSize: fields["Retrospective sample size"],
              prospectiveSampleSize: fields["Prospective sample size"],
              genotyping: fields["Genotyping"],
              wes: fields["WES"],
              wgs: fields["WGS"],
              otherAssays: fields["Other assays"],
              studyDesign: fields["Study design"],
              studyDesignUnformatted: fields["Study design unformatted"],
              affiliation: fields["Affiliation"],
              city: fields["City"],
              country: fields["Country"],
              researchQuestion: fields["Research Question"],
              study: fields["Study"],
              studyLink: fields["Study link"],
              assaysPlanned: fields["Additional assays planned"],
              researchCategory: fields["Research Category"],
              timeCreated: Date.parse(fields["Time created"]),
              mapLocation: fields["Map location"],
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
