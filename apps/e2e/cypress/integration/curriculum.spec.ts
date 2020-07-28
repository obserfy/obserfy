describe("test curriculum features", () => {
  const faker = require("faker")

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
    const newAreaName = faker.name.firstName()
    const newSubjectName = faker.name.firstName()
    const newMaterialNames = [
      faker.name.firstName(),
      faker.name.firstName(),
      faker.name.firstName(),
      faker.name.firstName(),
    ]
    cy.visit("/dashboard/admin/curriculum")

    cy.contains("Use Default", { matchCase: false }).click()
    cy.contains("New Area").click()
    cy.contains("Area Name", { matchCase: false }).type(newAreaName)
    cy.contains("Save").click()

    cy.contains("h6", newAreaName).click()
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
