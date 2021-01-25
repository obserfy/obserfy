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
})
