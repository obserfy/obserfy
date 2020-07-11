describe("test class related features", () => {
  const faker = require("faker")

  beforeEach(() => {
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const schoolName = faker.company.companyName()

    cy.request({
      method: "POST",
      url: "/auth/register",
      body: { email, password, name },
      form: true,
    })

    cy.request("POST", "/api/v1/schools", { name: schoolName }).then(
      (result) => {
        window.localStorage.setItem("SCHOOL_ID", result.body.id)
      }
    )
  })

  it("should be able to add, view, and delete class", () => {
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
    // cy.get("[cy-data=active]").should("have.text", "Sunday")

    cy.contains("Delete").click()
    cy.contains("Yes").click()

    cy.contains(className).should("not.exist")
  })
})
