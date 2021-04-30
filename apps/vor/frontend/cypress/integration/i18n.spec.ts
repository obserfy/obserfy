describe("test i18n", function () {
  beforeEach(function () {
    // cy.clearSW()
    cy.registerVor()
  })

  it("should be able to switch language", function () {
    cy.visit("/dashboard/admin")
    cy.wait(250) // wait for event handler to register
    cy.get("[data-cy=switch-indonesian]").click()
    cy.contains("Indonesian").should("be.visible")

    cy.visit("/")
    cy.location("pathname").should("equal", `/id/dashboard/students`)
    cy.wait(100)
    cy.get("[data-cy=navbar-admin]").click()

    cy.contains("Indonesian").should("be.visible")
    cy.get("[data-cy=switch-english]").click()
    cy.contains("English").should("be.visible")
    cy.visit("/")

    cy.location("pathname").should("equal", `/dashboard/students`)
  })
})
