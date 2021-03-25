describe("test i18n", function () {
  beforeEach(function () {
    // cy.clearSW()
    cy.registerVor()
  })

  it("should be able to switch language", function () {
    cy.visitVor("/dashboard/admin")
    cy.wait(250) // wait for event handler to register
    cy.get("[data-cy=switch-indonesian]").click()
    cy.contains("Indonesian").should("be.visible")

    cy.visitVor("/")
    cy.url().should(
      "equals",
      `${Cypress.env("VOR_HOST")}/id/dashboard/students`
    )
    cy.get("[data-cy=navbar-admin]").click()

    cy.contains("Indonesian").should("be.visible")
    cy.get("[data-cy=switch-english]").click()
    cy.contains("English").should("be.visible")
    cy.visitVor("/")
    cy.url().should("equals", `${Cypress.env("VOR_HOST")}/dashboard/students`)
  })
})
