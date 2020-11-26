describe("test gaia authentication", () => {
  beforeEach(() => {
    cy.clearSW()
    // workaround for cypress #781
    // @ts-ignore
    cy.clearCookies({ domain: null })
    cy.exec("yarn run db:reset")
  })

  it("should be redirected to login when logged out", () => {
    cy.visitGaia("/")
    cy.wait(200)
    cy.url().should("include", "auth0.com")
  })

  it("should show info when user have no data", () => {
    cy.visitGaia("/")
    cy.wait(200)
    cy.get("#username").type(Cypress.env("GAIA_USERNAME"))
    cy.get("#password").type(Cypress.env("GAIA_PASSWORD"))
    cy.contains("Continue").click()
  })
})
