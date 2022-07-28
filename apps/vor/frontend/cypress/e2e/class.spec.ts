import faker from "faker"

describe("test class related features", function () {
  beforeEach(function () {
    // cy.clearSW()
    cy.registerVor()
  })

  it("should be able to add, view, and delete class", function () {
    const className = faker.name.firstName()
    const startTime = "12:00"
    cy.visit("/dashboard/admin/class")

    cy.contains("New Class").click()
    cy.contains("Name").type(className)
    cy.contains("Sunday").click()
    cy.contains("Start Time").type(startTime)
    cy.contains("Save").click()

    cy.contains(className).click()
    cy.contains("Name").find("input").should("have.value", className)
    cy.contains("Start Time").find("input").should("have.value", startTime)
    // TODO: Check that selected dates are saved correctly in the future.
    // cy.get("[data-cy=active]").should("have.text", "Sunday")

    cy.contains("Delete").click()
    cy.contains("Yes").click()

    cy.contains(className).should("not.exist")
  })
})
