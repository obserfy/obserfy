describe("observation parent access", function () {
  beforeEach(function () {
    cy.registerVor()
    cy.createStudent()
  })

  it("should be able to show observation to parents", function () {
    cy.exec(`yarn run db:reset ${Cypress.env("GAIA_USERNAME")}`)
    cy.createObservation(this.student.id, false)
      .then(() => cy.createGuardian(this.student.id))
      .then(() => cy.gaiaLogin())
      .then(() => {
        cy.visitGaia("/")
        cy.contains(this.observation.shortDesc).should("not.exist")
      })
      .then(() => cy.createObservation(this.student.id, true))
      .then(() => {
        cy.visitGaia("/")
        cy.contains(this.observation.shortDesc).should("be.visible")
      })
  })
})
