import { aliasQuery } from "../../support/graphql-test-utils";

describe("Talentsearch Direct Intake Page", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      aliasQuery(req, "browsePoolAdvertisements");
    });
  });

  context("Anonymous visitor", () => {
    it("renders page", () => {
      ["/en/browse/pools"].forEach((restrictedPath) => {
        cy.visit(restrictedPath);
        cy.wait("@gqlbrowsePoolAdvertisementsQuery");
        cy.findByRole("heading", { name: /browse jobs/i })
          .should("exist")
          .and("be.visible");
      });
    });

    it("has no accessibility errors", () => {
      cy.visit("/en/browse/pools");
      cy.wait("@gqlbrowsePoolAdvertisementsQuery");
      cy.injectAxe();
      cy.findByRole("heading", { name: /browse jobs/i }).should("exist");
      cy.checkA11y();
    });
  });
});
