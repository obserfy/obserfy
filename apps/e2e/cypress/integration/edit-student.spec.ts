describe("test student edit", () => {
  const faker = require("faker")
  let name
  let email
  let password
  let schoolName

  beforeEach(() => {
    window.navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })

    name = faker.name.firstName()
    email = faker.internet.email()
    password = faker.internet.password()
    schoolName = faker.company.companyName()

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

  it("should be able to edit student successfully", () => {
    cy.visit("/")

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
