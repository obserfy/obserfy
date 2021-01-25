describe("test image features", function () {
  beforeEach(function () {
    cy.registerVor()
    cy.createSchool()
    cy.createStudent()
  })

  it("should be able to add and delete images", function () {
    cy.visitVor(`/dashboard/students/gallery?studentId=${this.student.id}`)
    cy.get("[data-cy=upload-image]").attachFile("icon.png")
    cy.get("[data-cy=upload-image]").attachFile("icon.png")
    cy.get("[data-cy=upload-image]").attachFile("icon.png")
    cy.get("[data-cy=image]").should("have.lengthOf", 3)

    cy.get("[data-cy=image]").first().click()
    cy.contains("Delete").click()
    cy.get("[data-cy=confirm]").click()
    cy.get("[data-cy=image]").should("have.lengthOf", 2)

    cy.get("[data-cy=image]").first().click()
    cy.contains("Set as Profile").click()
    cy.get("[data-cy=confirm]").click()

    cy.visitVor("/")
    cy.get("[data-cy=profile-pic-image]").should("have.lengthOf", 1)
  })

  it("should be able to upload image on gaia", function () {
    cy.exec(`yarn run db:reset ${Cypress.env("GAIA_USERNAME")}`)
    cy.createGuardian(this.student.id)
      .then(() => cy.gaiaLogin())
      .then(() => {
        cy.visitGaia("/")
        cy.contains(this.student.name).should("be.visible")
        cy.contains("Images").click()
        cy.get("#upload-image-small").attachFile("icon.png")
        cy.get("[data-cy=image]").should("have.lengthOf", 1)
        cy.get("#upload-image").attachFile("icon.png")
        cy.wait(200)
        cy.get("[data-cy=image]").should("have.lengthOf", 2)
        cy.get("[data-cy=image]").first().click()
        cy.get("[data-cy=close]").click()
      })
  })
})
