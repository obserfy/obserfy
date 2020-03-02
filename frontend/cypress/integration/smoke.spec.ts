// Test the whole happy path
import faker from "faker"

describe(" Smoke test on prod build", () => {
  it("should run smoke test successfully", () => {
    // define new user dynamically
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const schoolName = faker.company.companyName()

    cy.visit("http://localhost:8001")
    cy.waitForRouteChange()

    // Try logging in and fail
    cy.contains("Email").type(email)
    cy.contains("Password").type(password)
    cy.contains("Login").click()
    cy.contains("Wrong").should("be.visible")

    // Register account
    cy.contains("Register").click()
    cy.waitForRouteChange()
      .url()
      .should("contains", "register")
    cy.get("[data-cy=register-email]").type(email)
    cy.contains("Password").type(password)
    cy.contains("Name").type(name)
    cy.get("[data-cy=register-button]").click()

    // Create School
    cy.waitForRouteChange()
      .contains("New")
      .click()
    cy.contains("Name").type(schoolName)
    cy.contains("Save").click()
    cy.contains(schoolName).click()

    // Logout
    cy.url().should("contains", "dashboard")
    cy.contains("Settings").click()
    cy.contains("Log Out").click()

    // Login
    cy.url().should("contains", "login")
    cy.contains("Email").type(email)
    cy.contains("Password").type(password)
    cy.contains("Login").click()

    // Choose school
    cy.url().should("contains", "school")
    cy.contains(schoolName).click()

    // Change theme
    cy.contains("Settings").click()
    cy.contains("Dark Mode").click()
    cy.contains("Light Mode").click()

    // Check sidebar links
    cy.url().should("contains", "settings")
    cy.contains("Observe")
      .click()
      .waitForRouteChange()
    cy.url().should("contains", "observe")

    // Create student
    let studentName = "Carol"
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
    cy.get("[data-cy=set-button]").click()
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
    cy.get("[data-cy=observation-short-desc]")
      .contains(shortDesc)
      .should("be.visible")
    cy.get("[data-cy=observation-long-desc]")
      .contains(details)
      .should("be.visible")

    // Change student name
    studentName = "Jane Doe"
    cy.get("[data-cy=edit]").click()
    cy.contains("Name")
      .find("input")
      .clear()
      .type(studentName)
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
    cy.get("[data-cy=set-button]").click()
    cy.contains("Save").click()

    // Edit observation
    cy.waitForRouteChange()
      .url()
      .should("contains", "students")
    cy.get("[data-cy=edit-observation]").click()
    cy.get("[aria-label=Details]").type("Some additional text")
    cy.contains("Save").click()
    cy.contains("Some additional text").should("be.visible")

    // Delete observation
    cy.get("[data-cy=delete-observation]").should("be.visible")
    // TODO: This part is really flaky, try fixing it later.
    cy.wait(1000)
    cy.get("[data-cy=delete-observation]").click()
    cy.wait(1000)
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
    cy.contains(/Observe/i)
      .click()
      .waitForRouteChange()
    cy.url().should("contains", "observe")
    cy.contains(studentName)
      .click()
      .waitForRouteChange()

    // Click on tabs
    cy.contains("Math").click()

    // Open all progress
    cy.contains("See All ")
      .click()
      .waitForRouteChange()

    // Change something to Practiced
    cy.contains("Number Rods").click()
    cy.contains("Save changes").should("be.disabled")
    cy.get("[aria-label=Progress]").select("1")
    cy.contains("Save changes").click()

    // Go back and see if it shows up
    cy.contains("Practiced").should("be.visible")
    cy.contains("Student Details")
      .click({ force: true })
      .waitForRouteChange()

    // Change to master
    cy.contains("See All Math").should("be.visible")
    cy.contains("Practiced")
      .should("be.visible")
      .click()

    cy.get("[aria-label=Progress]").select("2")
    cy.contains("Save changes").click()

    // Make sure it shows up
    cy.contains("Mastered").should("be.visible")
  })
})
