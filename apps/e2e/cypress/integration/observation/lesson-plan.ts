describe("test observation features", function () {
  beforeEach(function () {
    cy.registerVor()
    cy.createStudent()
  })

  it("should be able to post and delete observation to lesson plan", function () {
    cy.exec(`yarn run db:reset ${Cypress.env("GAIA_USERNAME")}`)
    cy.createLessonPlan(this.student.id)
      .then(() => cy.createGuardian(this.student.id))
      .then(() => cy.gaiaLogin())
      .then(() => {
        cy.visitGaia("/lesson-plan")
        cy.contains(this.lessonPlan.title).should("not.exist")
        cy.contains("Add observation").click()
        cy.contains("label", "Observation").type("test")
        cy.contains("Post").click()
        cy.contains("test").should("be.visible")

        cy.contains("Edit").click()
        cy.contains("Edit observation").type(" another test")
        cy.contains("Save").click()
        cy.contains("test another test").should("be.visible")

        cy.contains("Edit").click()
        cy.get("[data-cy=delete-observation]").click({ force: true })
        cy.contains("Yes").click()
        cy.contains("test another test").should("not.exist")
      })
  })
})
