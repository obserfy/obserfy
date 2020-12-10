describe("test edit student", function () {
  beforeEach(function () {
    cy.clearSW()
    cy.registerVor()
  })

  it("should be able to edit student successfully", function () {
    cy.visitVor("/")

    // Create student
    const studentName = "Carol"
    const newName = "jane"
    cy.get("main").within(() => {
      cy.get("[data-cy=new-student-button]").click()
    })
    cy.contains("Name").type(studentName)
    cy.contains("Save").click()

    cy.contains(studentName).click()
    cy.contains("Profile").click()

    cy.get("[aria-label=edit-name]").click()
    cy.contains("label", "Name").find("input").clear().type(newName)
    cy.contains("Save").click()
    cy.contains(newName).should("be.visible")

    cy.get('[aria-label="edit-gender"]').click()
    cy.contains("label", "Gender").find("select").select("1")
    cy.contains("Save").click()
    cy.contains("Male").should("be.visible")

    cy.get('[aria-label="edit-student id"]').click()
    cy.contains("label", "Student ID").find("input").clear().type("test")
    cy.contains("Save").click()
    cy.contains("test").should("be.visible")
  })
})
