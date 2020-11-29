/// <reference types="cypress" />
const faker = require("faker")
const { seal, loginTestUser, getUserInfo } = require("./auth0")

declare namespace Cypress {
  type CustomCommand<T extends (...args: any) => void> = (
    ...args: Parameters<T>
  ) => Chainable<Element>
  interface Chainable {
    clearSW: CustomCommand<typeof clearSW>
    visitVor: CustomCommand<typeof visitVor>
    visitGaia: CustomCommand<typeof visitGaia>
    fixedClearCookies: CustomCommand<typeof fixedClearCookies>
    registerVor: CustomCommand<typeof registerVor>
    createClass: CustomCommand<typeof createClass>
    gaiaLogin: CustomCommand<typeof gaiaLogin>
  }
}

// @ts-ignore
const fixedClearCookies = () => cy.clearCookies({ domain: null })
const visitVor = (path: string) => cy.visit(Cypress.env("VOR_HOST") + path)
const visitGaia = (path: string) => cy.visit(Cypress.env("GAIA_HOST") + path)
const clearSW = () => {
  if (typeof window !== "undefined" && window.navigator.serviceWorker) {
    window.navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  }
}

const registerVor = () => {
  const name = faker.name.firstName()
  const email = faker.internet.email()
  const password = faker.internet.password()
  const schoolName = faker.company.companyName()

  cy.request({
    method: "POST",
    url: `${Cypress.env("VOR_HOST")}/auth/register`,
    body: { email, password, name },
    form: true,
  })

  cy.request("POST", `${Cypress.env("VOR_HOST")}/api/v1/schools`, {
    name: schoolName,
  }).then((result) => {
    window.localStorage.setItem("SCHOOL_ID", result.body.id)
  })

  cy.wrap({ name, email, password, schoolName }).as("vorUser")
}

const createClass = () => {
  const newClass = {
    endTime: "2020-04-26T03:00:00.000Z",
    name: faker.company.companyName(),
    startTime: "2020-04-26T02:00:00.000Z",
    weekdays: [1],
  }

  cy.request(
    "POST",
    `${Cypress.env("VOR_HOST")}/api/v1/schools/${localStorage.getItem(
      "SCHOOL_ID"
    )}/classes`,
    newClass
  )

  cy.wrap(newClass).as("newClass")
}

const gaiaLogin = () => {
  cy.setCookie("a0:state", "some-random-state", {
    domain: Cypress.env("GAIA_DOMAIN"),
  })

  cy.wrap(null)
    .then(() => loginTestUser())
    .then((response) => {
      const { accessToken, expiresIn, idToken, scope } = response
      return getUserInfo(accessToken).then((user: any) => {
        const persistedSession = {
          user,
          idToken,
          accessToken,
          accessTokenScope: scope,
          accessTokenExpiresAt: Date.now() + expiresIn,
          createdAt: Date.now(),
        }

        return seal(persistedSession).then((encryptedSession: any) => {
          cy.setCookie("a0:session", encryptedSession, {
            domain: Cypress.env("GAIA_DOMAIN"),
          })
        })
      })
    })
}

Cypress.Commands.add("clearSW", clearSW)
Cypress.Commands.add("visitVor", visitVor)
Cypress.Commands.add("visitGaia", visitGaia)
Cypress.Commands.add("fixedClearCookies", fixedClearCookies)
Cypress.Commands.add("registerVor", registerVor)
Cypress.Commands.add("createClass", createClass)
Cypress.Commands.add("gaiaLogin", gaiaLogin)
