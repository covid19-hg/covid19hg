import {
  acknowledgementsStudyTitle,
  partnersDetailCardTitleCyDataAttr,
} from "../../src/cypressTestDataAttrs";

beforeEach(() => {
  cy.server();
  cy.route({
    method: "GET",
    url: "/.netlify/functions/acknowledgement*",
    response: "fixture:acknowledgements.json",
  });
  cy.route({
    method: "GET",
    url: "/.netlify/functions/partners*",
    response: "fixture:partners.json",
  }).as("partnersApiCall");
  cy.visit("/acknowledgements/");
});

it("Title of study should link to the corresponding study on partners page", () => {
  cy.get(`cy:${acknowledgementsStudyTitle}`).contains("Lifelines").click();
  cy.wait("@partnersApiCall");
  cy.get(`cy:${partnersDetailCardTitleCyDataAttr}`).contains("Lifelines");
});

it("Adhoc group title should not be a link", () => {
  cy.get(`cy:${acknowledgementsStudyTitle}`).contains("In silico").click();
  cy.get(`cy:${partnersDetailCardTitleCyDataAttr}`).should("not.exist");
});
