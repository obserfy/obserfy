describe("test pwa works correctly", function () {
  beforeEach(function () {
    cy.clearSW()
    cy.registerVor()
  })

  it("should handle redirect correctly", function () {
    // first visit, should install service worker and caches stuffs
    cy.visitVor("/")

    // second visit should be redirected to dashboard
    cy.visitVor("/")
    cy.url().should("contains", "dashboard")

    // so does every other visits visit
    for (let i = 0; i < 10; i += 1) {
      cy.visitVor("/")
      cy.url().should("contains", "dashboard")
      cy.visitVor("/login")
      cy.url().should("contains", "dashboard")
    }

    // shouldn't be able to visit dashboard after logging out
    cy.request("POST", "auth/logout")
    cy.visitVor("/")
    cy.url().should("contains", "login")
    cy.visitVor("/")
    cy.url().should("contains", "login")
  })
})
