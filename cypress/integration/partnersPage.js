import {
  partnersStudyListCountCypressDataAttr,
  partnersStudyListItemCypressDataAttr,
  partnersDetailCardTitleCyDataAttr,
  partnersStudyTypeFilter,
  partnersAssaysPlannedOption,
  partnersAssaysPlannedSelector,
  partnersInvestigatorContactButton,
  partnersInvestigatorContactFormName,
  partnersInvestigatorContactFormEmail,
  partnersInvestigatorContactFormMessage,
  partnersInvestigatorContactFormCancelButton,
  partnersInvestigatorContactFormSendButton,
} from "../../src/cypressTestDataAttrs";

beforeEach(() => {
  cy.server();
  cy.route({
    method: "GET",
    url: "/.netlify/functions/partners*",
    response: "fixture:partners.json",
  });
  cy.route({
    method: "POST",
    url: "/.netlify/functions/contact-investigator",
    responseCode: 200,
    response: {},
  }).as("contactInvestigatorCall");

  cy.visit("/partners/");
});

it("Study list should show all studies if no filters are applied", () => {
  cy.get(`cy:${partnersStudyListCountCypressDataAttr}`).contains("15");
});

it("Filtering on retrospective/prospective study types should work", () => {
  // only retrospective checked:
  cy.get(`cy:${partnersStudyTypeFilter}`).contains("Retrospective").click();
  cy.get(`cy:${partnersStudyListCountCypressDataAttr}`).contains("7");

  // retrospective + prospective checked:
  cy.get(`cy:${partnersStudyTypeFilter}`).contains("Prospective").click();
  cy.get(`cy:${partnersStudyListCountCypressDataAttr}`).contains("4");

  // only prospective checked:
  cy.get(`cy:${partnersStudyTypeFilter}`).contains("Retrospective").click();
  cy.get(`cy:${partnersStudyListCountCypressDataAttr}`).contains("11");

  // none checked:
  cy.get(`cy:${partnersStudyTypeFilter}`).contains("Prospective").click();
  cy.get(`cy:${partnersStudyListCountCypressDataAttr}`).contains("15");
});

it("Filtering on assays planned should work", () => {
  cy.get("body").as("body");
  cy.get(`cy:${partnersStudyListCountCypressDataAttr}`).as("studyCount");

  cy.get(`cy:${partnersAssaysPlannedSelector}`).as("selector").click();

  // Select one assay
  cy.get(`cy:${partnersAssaysPlannedOption}`)
    .contains("Viral sequencing")
    .click();
  cy.get("@studyCount").contains("5");
  // Add another:
  cy.get(`cy:${partnersAssaysPlannedOption}`)
    .contains("Transcriptomics")
    .click();
  cy.get("@studyCount").contains("3");
  // Then add another:
  cy.get(`cy:${partnersAssaysPlannedOption}`).contains("Proteomics").click();
  cy.get("@studyCount").contains("2");
  // Remove one assay:
  cy.get(`cy:${partnersAssaysPlannedOption}`)
    .contains("Viral sequencing")
    .click();
  cy.get("@studyCount").contains("5");
  // Remove another assay:
  cy.get(`cy:${partnersAssaysPlannedOption}`).contains("Proteomics").click();
  cy.get("@studyCount").contains("8");
  // Remove last assay:
  cy.get(`cy:${partnersAssaysPlannedOption}`)
    .contains("Transcriptomics")
    .click();
  cy.get("@studyCount").contains("15");

  // Close selector
  cy.get("@body").click();
  cy.get(`cy:${partnersAssaysPlannedOption}`).should("not.exist");
});

it("Clicking on a study in study list should show details about that study", () => {
  cy.get(`cy:${partnersStudyListItemCypressDataAttr}`)
    .contains("Estonian")
    .click();
  cy.get(`cy:${partnersDetailCardTitleCyDataAttr}`).contains("Estonian");
});

describe('"contact investigator" feature', () => {
  it("should send correct message request", () => {
    cy.get(`cy:${partnersStudyListItemCypressDataAttr}`)
      .contains("IGC.PT")
      .click();
    cy.get(`cy:${partnersInvestigatorContactButton}`).should("not.exist");

    cy.get(`cy:${partnersStudyListItemCypressDataAttr}`)
      .contains("Netherlands")
      .click();
    cy.get(`cy:${partnersInvestigatorContactButton}`).click();

    cy.get(`cy:${partnersInvestigatorContactFormName}`).type("Huy Nguyen");
    cy.get(`cy:${partnersInvestigatorContactFormEmail}`).type(
      "huy@broadinstitute.org"
    );
    cy.get(`cy:${partnersInvestigatorContactFormMessage}`).type(
      "This is a test message."
    );

    cy.get(`cy:${partnersInvestigatorContactFormSendButton}`).should(
      "be.disabled"
    );

    // TODO: find a more robust way to click on captcha button:
    cy.getIframeBody().within(() => {
      cy.get("#recaptcha-anchor").click();
    });

    cy.get(`cy:${partnersInvestigatorContactFormSendButton}`).click();
    cy.get("@contactInvestigatorCall")
      .its("request.body.name")
      .should("contain", "Huy Nguyen");
    cy.get("@contactInvestigatorCall")
      .its("request.body.email")
      .should("contain", "huy@broadinstitute.org");
    cy.get("@contactInvestigatorCall")
      .its("request.body.message")
      .should("contain", "This is a test message.");
  });

  it.skip(
    "should show error message anad allow retry when message request fails"
  );
  it.skip("should close dialog when cancel button is clicked");
});
