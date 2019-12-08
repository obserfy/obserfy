describe("auth flow test", () => {
  const email = "johnny@gmail.com"
  const username = "Johnny Silverstone"
  const password = "justatest"

  beforeEach(() => {
    cy.visit("https://localhost:8001/login")
    cy.clearCookies()
  })

  it("should be able to sign up", () => {
    cy.contains("Sign Up").click()
    cy.contains("Email")
      .click()
      .type(email)
    cy.contains("Name")
      .click()
      .type(username)
    cy.contains("Password")
      .click()
      .type(password)
    cy.contains("Sign Up").click()
    cy.url().should("include", "/choose-school")
  })

  it("should be able to log in then logout", () => {
    cy.request({
      method: "POST",
      form: true,
      url: "/auth/register",
      body: {
        name: username,
        email,
        password
      }
    })
    cy.contains("Email")
      .click()
      .type(email)
    cy.contains("Password")
      .click()
      .type(password)
    cy.contains("Login").click()
    cy.url().should("include", "/choose-school")

    cy.get("[data-cy=newSchool]").click()
    cy.contains("Name")
      .click()
      .type("Ad Astra")

    cy.contains("Save").click()
    cy.url().should("include", "/")
    cy.contains("Ad Astra").click()
    cy.url().should("eq", "https://localhost:8001/")

    cy.get("[data-cy=schoolName]").click()
    cy.contains("Log out").click()
    cy.url().should("eq", "https://localhost:8001/login")

    // Make sure we can't access home after logging out
    cy.visit("https://localhost:8001/")
    cy.url().should("eq", "https://localhost:8001/login")
  })
})
