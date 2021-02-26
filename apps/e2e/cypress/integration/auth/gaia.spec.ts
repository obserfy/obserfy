describe("test gaia authentication", function () {
  beforeEach(function () {
    // cy.clearSW()
    cy.fixedClearCookies()
    cy.exec(`yarn run db:reset ${Cypress.env("GAIA_USERNAME")}`)
  })

  it("should show info when user have no data", function () {
    cy.visitGaia("/")
    cy.wait(500)
    cy.url().should("include", "auth0.com")

    cy.gaiaLogin()
    cy.visitGaia("/")
    cy.contains("We can't seem to find your data yet").should("be.visible")
  })
})
