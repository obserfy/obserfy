import faker from "faker"

describe("test curriculum features", function () {
  beforeEach(function () {
    // cy.clearSW()
    cy.registerVor()
  })

  it("should be able to add, view, and delete class", function () {
    const newAreaName = faker.name.firstName()
    const newSubjectName = faker.name.firstName()
    const newMaterialNames = [
      faker.name.firstName(),
      faker.name.firstName(),
      faker.name.firstName(),
      faker.name.firstName(),
    ]
    cy.visit("/dashboard/admin/curriculum")

    cy.wait(100)
    cy.contains("Use Montessori", { matchCase: false }).click()
    cy.contains("Add new area").click()
    cy.contains("Area Name", { matchCase: false }).type(newAreaName)
    cy.contains("Save").click()

    cy.contains("p", newAreaName).click()
    cy.wait(500)
    cy.contains("Add new subject").click()

    cy.contains("Subject name").type(newSubjectName)
    cy.contains("Save").click()
    cy.contains(newSubjectName).click()

    newMaterialNames.forEach((name) => {
      cy.contains("Add new material").click()
      cy.contains("Material name").type(name)
      cy.contains("Save").click()
    })

    newMaterialNames.forEach((name) => {
      cy.contains(name).should("be.visible")
    })
  })
})
