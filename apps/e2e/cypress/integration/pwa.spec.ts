import * as faker from "faker"

describe("test pwa works correctly", () => {
  let name
  let email
  let password
  let schoolName

  beforeEach(() => {
    if (window.navigator && navigator.serviceWorker) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister()
        })
        localStorage.clear()
      })
    }

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

  it("should handle redirect correctly", () => {
    // first visit, should install service worker and caches stuffs
    cy.visit("/")

    // second visit should be redirected to dashboard
    cy.visit("/")
    cy.url().should("contains", "dashboard")

    // so does third visit
    cy.visit("/")
    cy.url().should("contains", "dashboard")
    cy.visit("/login")
    cy.url().should("contains", "dashboard")

    // shouldn't be able to visit dashboard after logging out
    cy.request("POST", "auth/logout")
    cy.visit("/")
    cy.url().should("contains", "login")
    cy.visit("/")
    cy.url().should("contains", "login")
  })
})
