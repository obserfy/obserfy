// Test the whole happy path
import faker from "faker"

describe(" Smoke test on prod build", () => {
  it("should run smoke test successfully", () => {
    // define new user dynamically
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const schoolName = faker.company.companyName()

    cy.visit("https://localhost:8001")

    // Try logging in and fail
    cy.contains("Email").type(email)
    cy.contains("Password").type(password)
    cy.contains("Login").click()
    cy.contains("Wrong").should("be.visible")

    // Register account
    cy.contains("Sign Up").click()
    // TODO: This part seems to be flaky.
    cy.contains("Email").type(email)
    cy.contains("Password").type(password)
    cy.contains("Name").type(name)
    cy.contains("Sign Up").click()

    // Create School
    cy.contains("New").click()
    cy.contains("Name").type(schoolName)
    cy.contains("Save").click()
    cy.contains(schoolName).click()

    // Logout
    cy.contains(name).click()
    cy.contains("Log out").click()

    // Login
    cy.contains("Email").type(email)
    cy.contains("Password").type(password)
    cy.contains("Login").click()

    // Choose school
    cy.contains(schoolName).click()

    // Change theme
    cy.contains("Dark Mode").click()
    cy.contains("Light Mode").click()

    // Check sidebar links
    cy.contains(/settings/i).click()
    // TODO: this is flaky, sometimes work sometimes don't, so we doubled it.
    cy.contains(/Home/i).click()
    cy.contains(/Home/i).click()

    // Create student
    const studentName = "Carol"
    cy.contains(/New Student/i).click()
    cy.contains("Save").should("be.disabled")
    cy.contains("Name").type(studentName)
    cy.contains("Date of Birth").click()
    cy.contains("Year")
      .find("input")
      .clear()
      .type("2010")
    cy.contains("Month")
      .find("select")
      .select("4")
    cy.get("[aria-label=Date]").select("11")
    cy.contains("Set").click()
    cy.contains("Save").click()
    cy.contains(studentName).should("be.visible")

    // Create observation, Check observation content
    const shortDesc = "He is improving in a rapid rate"
    const details =
      "Bla bla black sheep have you any war. Yes shire yes shire tea bag fool"
    cy.contains(studentName).click()
    cy.contains("New").click()
    cy.get("[aria-label=Category]").select("2")
    cy.contains("Short Description").type(shortDesc)
    cy.get("[aria-label=Details]").type(details)
    cy.contains("Add").click()
    cy.contains(shortDesc).should("be.visible")
    cy.contains(details).should("be.visible")

    // Change student name
    cy.get("[data-cy=edit]").click()
    cy.contains("Name")
      .find("input")
      .clear()
      .type("Jane Doe")
    cy.contains("Save").click()

    // Change student dob
    cy.get("[data-cy=edit]").click()
    cy.contains("Name")
      .find("input")
      .clear()
      .type("Jane Doe")
    cy.contains("Date of Birth").click()
    cy.contains("Month")
      .find("select")
      .select("6")
    cy.contains("Set").click()
    cy.contains("Save").click()

    // Edit observation
    cy.contains("Edit").click()
    cy.get("[aria-label=Details]").type("Some additional text")
    cy.contains("Save").click()
    cy.contains("Some additional text").should("be.visible")

    // Delete observation
    cy.contains("delete").click()
    cy.contains("Yes,").click()
    cy.contains(shortDesc).should("not.be.visible")

    // Go to curriculum
    cy.contains("Go to Curriculum").click()
    // Go to settings
    // Go back to curriculum
    // Create default curriculum TODO: This test will be flaky.
    // Go to a student
    // Click on tabs
    // Open all progress
    // Change something to Practiced
    // Go back and see if it shows up
    // Change to master
    // Make sure it shows up
    // Go to all progress, and set it to not practiced
    // Go back make sure gon.
  })
})
