import {
  contactFormNameCypressDataAttr,
  contactFormEmailCypressDataAttr,
  contactFormMessageCypressDataAttr,
  contactFormSubmitCypressDataAttr,
} from "../../src/cypressTestDataAttrs";

beforeEach(() => {
  cy.visit("/contact/");
});

it("submitted form should contai name, email and message", () => {
  cy.server();
  cy.route({
    method: "POST",
    url: "/",
    status: 200,
    response: {},
  }).as("formSubmission");
  cy.get(`cy:${contactFormSubmitCypressDataAttr}`)
    .as("submit")
    .should("be.disabled");

  cy.get(`cy:${contactFormNameCypressDataAttr}`).type("Huy Nguyen");
  cy.get(`cy:${contactFormEmailCypressDataAttr}`).type(
    "huy@broadinstitute.org"
  );
  cy.get(`cy:${contactFormMessageCypressDataAttr}`).type(
    "This is a test message."
  );
  // TODO: find a more robust way to click on captcha button, possibly by
  // switching to a different Google Recaptcha library:
  cy.getIframeBody().within(() => {
    cy.get("#recaptcha-anchor").click();
  });
  cy.get("@submit").should("not.be.disabled").click();
  cy.wait("@formSubmission");
  cy.get("@formSubmission")
    .its("request.body")
    .then(decodeURIComponent)
    .should("include", "Huy Nguyen")
    .should("include", "huy@broadinstitute.org")
    .should("include", "This is a test message");
});
