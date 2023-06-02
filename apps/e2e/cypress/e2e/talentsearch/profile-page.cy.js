describe("Talentsearch Profile Page", () => {
  // Helpers
  const onLoginInfoPage = () => {
    cy.url().should("contain", "/en/login-info");
  };

  context("Anonymous visitor", () => {
    it("redirects restricted pages to login", () => {
      ["/en/talent/profile", "/en/users/test-applicant/profile"].forEach(
        (restrictedPath) => {
          cy.visit(restrictedPath);
          onLoginInfoPage();
        },
      );
    });
  });

  context("logged in but no applicant role", () => {
    beforeEach(() => cy.loginByRole("noroles"));

    it("displays not authorized", () => {
      /**
       * React error boundaries are bubbling exceptions
       * up, so we need to tell cypress to ignore them
       *
       * REF: https://github.com/cypress-io/cypress/issues/7196#issuecomment-971592350
       */
      cy.on("uncaught:exception", () => false);

      [
        "/en/talent/profile",
        "/en/users/test-no-role/profile",
        "/en/users/test-no-role/profile/about-me/edit",
        "/en/users/test-no-role/profile/language-info/edit",
        "/en/users/test-no-role/profile/government-info/edit",
        "/en/users/test-no-role/profile/role-salary-expectations/edit",
        "/en/users/test-no-role/profile/work-location/edit",
        "/en/users/test-no-role/profile/work-preferences/edit",
        "/en/users/test-no-role/profile/employment-equity/edit",
        "/en/users/test-no-role/profile/experiences",
      ].forEach((restrictedPath) => {
        cy.visit(restrictedPath);
        cy.contains("not authorized");
      });
    });
  });

  context("logged in as applicant", () => {
    beforeEach(() => cy.loginByRole("applicant"));

    it("loads page successfully", () => {
      cy.visit("/en/users/test-applicant/profile");
      cy.contains("About me");
      cy.contains("Language information");
      cy.contains("Government information");
      cy.contains("Work location");
      cy.contains("Work Preferences");
      cy.contains("Diversity, equity and inclusion");

      cy.visit("/en/talent/profile");
      cy.contains("About me");
      cy.contains("Language information");
      cy.contains("Government information");
      cy.contains("Work location");
      cy.contains("Work Preferences");
      cy.contains("Diversity, equity and inclusion");
    });
  });
});
