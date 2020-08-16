describe("Test lesson plan features", () => {
  const faker = require("faker")

  const className = faker.company.companyName()
  const classStartTime = faker.date.recent()

  beforeEach(() => {
    window?.navigator?.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
      })

    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const schoolName = faker.company.companyName()

    const studentName = faker.name.firstName()

    cy.request({
      method: "POST",
      url: "/auth/register",
      body: { email, password, name },
      form: true,
    })

    cy.request("POST", "/api/v1/schools", { name: schoolName }).then(
      (result) => {
        window.localStorage.setItem("SCHOOL_ID", result.body.id)
        return cy
          .request("POST", `/api/v1/schools/${result.body.id}/classes`, {
            name: className,
            startTime: classStartTime.toISOString(),
            endTime: classStartTime.toISOString(),
          })
          .request("POST", `/api/v1/schools/${result.body.id}/students`, {
            name: studentName,
          })
          .then((studentResult) => {
            cy.visit(
              `/dashboard/students/plans?studentId=${studentResult.body.id}`
            )
          })
      }
    )
  })

  it("should be able to edit, create, and delete plans.", () => {
    const firstName = "A Bold New Plan"

    const secondName = "A bolder plan"
    const secondDescription = "A description"

    cy.get('[aria-label="next-date"]').click()

    // test create
    cy.contains("Add").click()
    cy.contains("Save").should("be.disabled")
    cy.contains("Title").type(firstName)
    cy.contains("Save").click()
    cy.contains(firstName).should("be.visible")

    // Test edit
    cy.contains(firstName).click()
    cy.get('[aria-label="edit-title"]').click()
    cy.contains("label", "Title").find("input").clear().type(secondName)
    cy.contains("Save").click()
    cy.contains(secondName).should("be.visible")

    cy.get('[aria-label="edit-description"]').click()
    cy.contains("label", "Description").find("textarea").type(secondDescription)
    cy.contains("Save").click()
    cy.contains(secondDescription).should("be.visible")

    cy.contains("All plans").click()
    cy.contains(secondName).should("be.visible")

    // Regression test, should be able to delete class
    cy.visit("/dashboard/admin/class")
    cy.contains(className).click()
    cy.contains("Delete").click()
    cy.contains("Yes").click()
    cy.contains(className).should("not.be.visible")
  })
})
