describe("test observation features", function () {
  beforeEach(function () {
    cy.registerVor()
    cy.createStudent()
  })

  it("should be able to create, edit, and delete observation", function () {
    // =========================== Create Observation ==========================
    cy.visitVor("/dashboard/students")
    cy.contains(this.student.name).click()
    cy.contains("Create observation").click()

    cy.contains("Short Description").type("A new description")
    cy.contains("Visible to guardians").click()
    cy.contains("Details").type("A detail")
    // cy.contains("Go to curriculum").click() // should show empty curriculum info when curriculum is empty
    cy.contains("Event Time").click()
    cy.contains("25").click()
    cy.contains("Set").click()
    cy.get("[data-cy=image]").should("have.lengthOf", 0) // ensure no images uploaded
    cy.get("[data-cy=upload-image]").attachFile("icon.png").wait(10_000)
    cy.get("[data-cy=image]").should("have.lengthOf", 1)
    cy.get("[data-cy=upload-image]").attachFile("icon.png").wait(10_000)
    cy.get("[data-cy=image]").should("have.lengthOf", 2)

    cy.contains("Save").click()

    cy.contains("A new description").should("be.visible")
    cy.contains("A detail").should("be.visible")
    cy.get("[data-cy=observation-image]").should("have.lengthOf", 2)

    // =========================== Edit Observation ==========================
    // edit description
    cy.contains("A new description").click()
    cy.get("[aria-label=edit-short-description]").click()
    cy.contains("label:visible", "Short Description").type(" great")
    cy.contains("Save").click()
    cy.contains("A new description great").should("be.visible")

    // edit time
    cy.get("[aria-label=edit-event-time]").click()
    cy.contains("18").click()
    cy.contains("Set").click()
    cy.contains("18").should("be.visible")

    // edit area (should show how to create curriculum)
    cy.get("[aria-label=edit-details]").click()
    cy.contains("label:visible", "Details").type(" better details here")
    cy.contains("Save").click()
    cy.contains("A detail better details here").should("be.visible")

    // add image
    cy.get("[data-cy=upload-image]").attachFile("icon.png")
    cy.get("[data-cy=image]").should("have.lengthOf", 3)
    cy.get("[data-cy=image]").first().click()
    cy.get("[data-cy=delete-image]").click()
    cy.get("[data-cy=image]").should("have.lengthOf", 2)

    // =========================== Delete Observation ==========================
    cy.get("[data-cy=delete-observation]").click()
    cy.contains("Yes").click()
    cy.contains("A new description great").should("not.exist")
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
