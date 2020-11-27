describe("test adding new student", () => {
  beforeEach(() => {
    cy.clearSW()
    cy.registerVor()
  })

  it("should be able to switch language", () => {
    cy.visitVor("/dashboard/admin")
    cy.wait(250) // wait for event handler to register
    cy.get("[data-cy=switch-indonesian]").click()
    cy.contains("Indonesian").should("be.visible")

    cy.visitVor("/")
    cy.url().should(
      "equals",
      `${Cypress.config().baseUrl}/id/dashboard/students`
    )
    cy.contains("Admin").click()

    cy.contains("Indonesian").should("be.visible")
    cy.get("[data-cy=switch-english]").click()
    cy.contains("English").should("be.visible")
    cy.visitVor("/")
    cy.url().should("equals", `${Cypress.config().baseUrl}/dashboard/students`)
  })
})
