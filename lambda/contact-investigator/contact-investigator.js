const sgMail = require("@sendgrid/mail");
const fetch = require("node-fetch");
const Handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");
const unthrottledFetchAirtableData = require("./fetchAirtableData");
const throttle = require("lodash/throttle");

const fetchAirtableData = throttle(unthrottledFetchAirtableData, 10000);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const templateString = fs.readFileSync(
  path.join(__dirname, "template.handlebars"),
  "utf8"
);
const template = Handlebars.compile(templateString);

exports.handler = async (event, context) => {
  const params =
    event.httpMethod.toUpperCase() === "GET"
      ? event.queryStringParameters
      : JSON.parse(event.body);
  const recaptchaReseponse = params["g-recaptcha-response"];
  try {
    // TODO: also need to verify the domain too.
    // Also should include IP
    const verificationResponse = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(
        process.env.SITE_RECAPTCHA_SECRET
      )}&response=${encodeURIComponent(recaptchaReseponse)}`,
      {
        method: "POST",
      }
    );
    if (verificationResponse.ok) {
      const responseData = await verificationResponse.json();
      if (responseData.success === true) {
        const studyId = params.studyId;
        try {
          const airtableData = await fetchAirtableData();
          const studyDatum = airtableData.find(({ id }) => id === studyId);
          if (studyDatum === undefined) {
            throw new Error("Invalid study id", studyId);
          } else {
            const emails = studyDatum.emails;
            console.log("Simulating email sent to", emails);
            const html = template({
              name: params.name,
              email: params.email,
              message: params.message,
            });
            const msg = {
              // TODO: replace with investigator's email:
              to: "huy@broadinstitute.org",
              // TODO: replace with real official emails:
              replyTo: "me@huy.dev",
              from: "huy@broadinstitute.org",

              subject:
                "Message from COVID-19 Host Genetics Initiative website visitor",
              html,
            };
            try {
              await sgMail.send(msg);
              return {
                statusCode: 200,
                body: JSON.stringify("Success"),
              };
            } catch (error) {
              console.error(error);
              if (error.message) {
                console.error("Error while sending email", error.message.body);
              }
              return {
                statusCode: 500,
                body: JSON.stringify({ msg: error.message }),
              };
            }
          }
        } catch (error) {
          console.error("Error fetching Airtable data", error.message);
          return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error sending email" }),
          };
        }
      } else {
        console.error(
          "Incorrect captcha response",
          responseData["error-codes"].join(", ")
        );
        return {
          statusCode: 400,
          body: JSON.stringify("Incorrect captcha response"),
        };
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify(
          "Error while attempting to verify captcha response"
        ),
      };
    }
  } catch (error) {
    console.error(error);
    if (error.message) {
      console.error("Unexpected error: ", error.message.body);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: error.message }),
    };
  }
};
