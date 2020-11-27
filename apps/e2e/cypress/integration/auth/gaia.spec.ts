describe("test gaia authentication", () => {
  beforeEach(() => {
    cy.clearSW()
    cy.fixedClearCookies()
    cy.exec(`yarn run db:reset ${Cypress.env("GAIA_USERNAME")}`)
  })

  it("should be redirected to login when logged out", () => {
    cy.visitGaia("/")
    cy.wait(500)
    cy.url().should("include", "auth0.com")
  })

  it("should show info when user have no data", () => {
    cy.visitGaia("/")
    cy.wait(500)
    cy.get("#username").type(Cypress.env("GAIA_USERNAME"))
    cy.get("#password").type(Cypress.env("GAIA_PASSWORD"))
    cy.contains("Continue").click()

    cy.contains("We can't seem to find your data yet").should("be.visible")
  })
})
