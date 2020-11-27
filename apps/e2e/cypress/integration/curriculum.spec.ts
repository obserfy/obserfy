describe("test curriculum features", () => {
  const faker = require("faker")

  beforeEach(() => {
    cy.clearSW()
    cy.registerVor()
  })

  it("should be able to add, view, and delete class", () => {
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
    cy.contains("New Area").click()
    cy.contains("Area Name", { matchCase: false }).type(newAreaName)
    cy.contains("Save").click()

    cy.contains("p", newAreaName).click()
    cy.wait(500)
    cy.contains("New").click()

    cy.contains("Subject name").type(newSubjectName)

    newMaterialNames.forEach((name) => {
      cy.contains("Add material").click()
      cy.get("[data-cy=materialNameInputEmpty]").type(name)
    })

    cy.contains("Save").click()
    newMaterialNames.forEach((name) => {
      cy.contains(name).should("be.visible")
    })
  })
})
