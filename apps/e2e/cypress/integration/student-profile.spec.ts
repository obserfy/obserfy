// Test the whole happy path

describe("test student profile page", () => {
  const faker = require("faker")
  let name
  let email
  let password
  let schoolName

  beforeEach(() => {
    window?.navigator?.serviceWorker
      .getRegistrations()
      .then((registrations) => {
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

  it("should be able to edit all student data.", () => {
    cy.visit("/")

    // Create student
    let studentName = "Carol"
    cy.get("main").within(() => {
      cy.get("[data-cy=new-student-button]").click()
    })
    cy.contains("Name").type(studentName)
    cy.contains("Save").click()

    // Create observation, Check observation content
    const shortDesc = "He is improving in a rapid rate"
    const details =
      "Bla bla black sheep have you any war. Yes shire yes shire tea bag fool"
    cy.contains(studentName).should("be.visible")
    cy.contains(studentName).click()
    cy.contains("Observation").click()
    cy.get("[aria-label=Category]").select("2")
    cy.contains("Short Description").type(shortDesc)
    cy.get("[aria-label=Details]").type(details)
    cy.contains("Add").click()
    cy.get("[data-cy=observation-short-desc]")
      .contains(shortDesc)
      .should("be.visible")
    cy.get("[data-cy=observation-long-desc]")
      .contains(details)
      .should("be.visible")

    // Change student name
    studentName = "Jane Doe"
    cy.contains("Profile").click()
    cy.get("[aria-label=edit-name]").click()
    cy.contains("label", "Name").find("input").clear().type(studentName)
    cy.contains("Save").click()
    cy.contains(studentName).should("be.visible")

    // Change student dob
    // cy.contains("Name").find("input").clear().type("Jane Doe")
    // cy.contains("Date of Birth").click()
    // cy.contains("Month").find("select").select("6")
    // cy.get("[data-cy=confirm]").click()
    // cy.contains("Save").click()

    // Test changing status
    cy.contains("Set As Inactive", { matchCase: false }).click()
    cy.contains("Yes").click()
    cy.wait(100)
    cy.get("[data-cy=active-button]").should("be.visible")
    cy.get("[data-cy=inactive-button]").should("not.be.visible")

    const guardianName = faker.name.firstName()
    cy.get("[data-cy=edit-guardians]").click()
    cy.get("[data-cy=new-guardian]").click()
    cy.contains("Guardian Name").type(guardianName)
    cy.contains("Save").click()
    cy.contains(guardianName).should("be.visible")

    // Remove guardian
    cy.get("[data-cy=remove-guardian]").click()
    cy.get("[data-cy=remove]").click()
    cy.contains(guardianName).should("be.visible")

    // Re-add guardian
    cy.wait(500)
    cy.get("[data-cy=add-guardian]").click()
    cy.get("[aria-label=Relationship]").select("1")
    cy.contains("Save").click()
    cy.contains(guardianName).should("be.visible")

    // Go back to student profile page.
    cy.contains("Student Profile").click()
    cy.contains(guardianName).should("be.visible")

    // Go back to overview
    cy.contains("Student Overview").click()

    // Edit observation
    cy.url().should("contains", "students")
    cy.get("[data-cy=edit-observation]").click()
    cy.get("[aria-label=Details]").type("Some additional text")
    cy.contains("Save").click()
    cy.contains("Some additional text").should("be.visible")

    // Delete observation
    cy.get("[data-cy=delete-observation]").should("be.visible")
    // TODO: This part is really flaky, try fixing it later.
    cy.get("[data-cy=delete-observation]").click()
    cy.get("[data-cy=confirm-delete]").click()
    cy.contains(shortDesc).should("not.be.visible")

    // Go to curriculum
    cy.contains("Go to Curriculum").click()

    // Go to settings
    // Go back to curriculum
    // Create default curriculum TODO: This test will be flaky.
    cy.contains("default").click()
    cy.contains("Math").should("exist")

    // Go to a student
    cy.contains(/Students/i).click()
    // .waitForRouteChange()
    cy.url().should("contains", "students")
    cy.contains(studentName).click()
    // .waitForRouteChange()

    // Click on tabs
    cy.contains("Math").click()

    // Open all progress
    cy.contains("See All ").click()
    // .waitForRouteChange()

    // Change something to Practiced
    cy.contains("Number Rods").click()
    cy.contains("Save changes").should("be.disabled")
    cy.get("[aria-label=Progress]").select("1")
    cy.contains("Save changes").click()

    // Go back and see if it shows up
    cy.contains("Practiced").should("be.visible")
    cy.contains("Student Details").click({ force: true })
    // .waitForRouteChange()

    // Change to master
    cy.contains("See All Math").should("be.visible")
    cy.contains("Practiced").should("be.visible").click()

    cy.get("[aria-label=Progress]").select("2")
    cy.contains("Save changes").click()

    // Make sure it shows up
    cy.contains("Mastered").should("be.visible")
  })
})
