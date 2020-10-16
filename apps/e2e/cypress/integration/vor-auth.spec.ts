describe("test authentication", () => {
  const faker = require("faker")

  beforeEach(() => {
    window.navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  })

  it("should be able to login and register", () => {
    // define new user dynamically
    const name = faker.name.firstName()
    const email = faker.internet.email()
    const password = faker.internet.password()

    const schoolName = faker.company.companyName()

    cy.visit("/")
    // cy.waitForRouteChange()

    // Try logging in and fail
    cy.contains("Email").type(email)
    cy.contains("Password").type(password)
    cy.contains("button", "Login").click()
    cy.contains("Wrong").should("be.visible")

    // Register account
    cy.contains("Sign Up")
      .click()
      // cy.waitForRouteChange()
      .url()
      .should("contains", "register")
    cy.get("[data-cy=register-email]").type(email)
    cy.contains("Password").type(password)
    cy.contains("Name").type(name)
    cy.get("[data-cy=register-button]").click()

    // Create School
    // cy.waitForRouteChange()
    cy.contains("New").click()
    cy.contains("Name").type(schoolName)
    cy.contains("Save").click()
    cy.contains(schoolName).click()

    // Logout
    cy.url().should("contains", "dashboard")
    cy.contains("Admin").click()
    cy.contains("Log Out").click()

    // Login
    cy.url().should("contains", "login")
    cy.contains("Email").type(email)
    cy.contains("Password").type(password)
    cy.contains("button", "Login").click()

    // Choose school
    cy.url().should("contains", "school")
    cy.contains(schoolName).click()

    // Change theme
    cy.contains("Admin").click()
    cy.get("[data-cy=dark-switch]").click()
    cy.get("[data-cy=light-switch]").click()

    // Check sidebar links
    cy.url().should("contains", "admin")
    cy.contains("Students").click()
    cy.url().should("contains", "students")
    cy.contains("Admin").click()
    cy.contains("Invite Your Team").click()

    // Test invite code
    cy.contains("https")
      .invoke("text")
      .then((text) => {
        const inviteCode = text.split("=")[1]
        const inviteUrl = `/register?inviteCode=${inviteCode}`
        cy.visit(inviteUrl)

        cy.contains("Join as").click()
        cy.contains(schoolName).should("be.visible")

        // logout again
        cy.clearCookies()

        // Register new user using invite link
        // define new user dynamically
        const name2 = faker.name.firstName()
        const email2 = faker.internet.email()
        const password2 = faker.internet.password()
        cy.visit(inviteUrl)
        cy.get("[data-cy=register-email]").type(email2)
        cy.contains("Password").type(password2)
        cy.contains("Name").type(name2)
        cy.get("[data-cy=register-button]").click()
        cy.contains(schoolName).should("be.visible")

        // register other user and manually use invite code
        const name3 = faker.name.firstName()
        const email3 = faker.internet.email()
        const password3 = faker.internet.password()
        cy.clearCookies()
        cy.visit("/register")
        cy.get("[data-cy=register-email]").type(email3)
        cy.contains("Password").type(password3)
        cy.contains("Name").type(name3)
        cy.get("[data-cy=register-button]").click()
        cy.wait(300)
        cy.contains(schoolName).should("not.be.visible")

        cy.visit(inviteUrl)
        cy.contains(`Join as ${name3}`).click()
        cy.contains("Your Schools").should("be.visible")
        cy.contains(schoolName).should("be.visible")
      })
  })
})
