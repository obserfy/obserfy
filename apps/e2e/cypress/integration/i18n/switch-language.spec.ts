describe("test adding new student", () => {
  const faker = require("faker")

  beforeEach(() => {
    cy.clearSW()

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

  it("should be able to switch language", () => {
    cy.visit("/dashboard/admin")
    cy.wait(250) // wait for event handler to register
    cy.get("[data-cy=switch-indonesian]").click()
    cy.contains("Indonesian").should("be.visible")

    cy.visit("/")
    cy.url().should(
      "equals",
      `${Cypress.config().baseUrl}/id/dashboard/students`
    )
    cy.contains("Admin").click()

    cy.contains("Indonesian").should("be.visible")
    cy.get("[data-cy=switch-english]").click()
    cy.contains("English").should("be.visible")
    cy.visit("/")
    cy.url().should("equals", `${Cypress.config().baseUrl}/dashboard/students`)
  })
})
