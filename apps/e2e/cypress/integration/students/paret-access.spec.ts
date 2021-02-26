describe("test parent access", function () {
  beforeEach(function () {
    // cy.clearSW()
    cy.registerVor()
  })
  it("should be able to show student to parent", function () {
    cy.exec(`yarn run db:reset ${Cypress.env("GAIA_USERNAME")}`)
    cy.createStudent()
      .then(() => cy.createGuardian(this.student.id))
      .then(() => cy.gaiaLogin())
      .then(() => {
        cy.visitGaia("/")
        cy.contains(this.student.name).should("be.visible")
      })
  })
})
