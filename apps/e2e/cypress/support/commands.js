// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import faker from "faker"
import auth0 from "auth0-js"
import Iron from "@hapi/iron"

Cypress.Commands.add("clearSW", () => {
  if (typeof window !== "undefined" && window.navigator.serviceWorker) {
    window.navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister()
      })
    })
  }
})

Cypress.Commands.add("visitVor", (path) => {
  cy.visit(Cypress.env("VOR_HOST") + path)
})

Cypress.Commands.add("visitGaia", (path) => {
  cy.visit(Cypress.env("GAIA_HOST") + path)
})

Cypress.Commands.add("fixedClearCookies", () => {
  // workaround for cypress #781
  // @ts-ignore
  cy.clearCookies({ domain: null })
})

Cypress.Commands.add("registerVor", () => {
  const name = faker.name.firstName()
  const email = faker.internet.email()
  const password = faker.internet.password()
  const schoolName = faker.company.companyName()

  cy.request({
    method: "POST",
    url: Cypress.env("VOR_HOST") + "/auth/register",
    body: { email, password, name },
    form: true,
  })

  cy.request(
    "POST",
    Cypress.env("VOR_HOST") + "/api/v1/schools",
    { name: schoolName },
  ).then(
    (result) => {
      window.localStorage.setItem("SCHOOL_ID", result.body.id)
    },
  )

  cy.wrap({ name, email, password, schoolName }).as("vorUser")
})

Cypress.Commands.add("createClass", () => {
  const newClass = {
    endTime: "2020-04-26T03:00:00.000Z",
    name: faker.company.companyName(),
    startTime: "2020-04-26T02:00:00.000Z",
    weekdays: [1],
  }

  cy.request(
    "POST",
    `${Cypress.env("VOR_HOST")}/api/v1/schools/${localStorage.getItem("SCHOOL_ID")}/classes`,
    newClass,
  )

  cy.wrap(newClass).as("newClass")
})


// Auth0 login flow for gaia
const auth = new auth0.WebAuth({
  domain: Cypress.env("AUTH0_DOMAIN"),
  clientID: Cypress.env("AUTH0_CLIENT_ID"),
})

Cypress.Commands.add("_loginTestUser", (options = {}) => {
  return new Cypress.Promise((resolve, reject) => {
    auth.client.loginWithDefaultDirectory({
      username: Cypress.env("GAIA_USERNAME"),
      password: Cypress.env("GAIA_PASSWORD"),
      audience: `https://${Cypress.env("AUTH0_DOMAIN")}/api/v2/`,
      scope: "openid profile email",
      client_secret: Cypress.env("AUTH0_CLIENT_SECRET"),
    }, (err, response) => {
      if (err) {
        reject(err)
      } else {
        resolve(response)
      }
    })
  })
})

Cypress.Commands.add("getUserInfo", (accessToken) => {
  return new Cypress.Promise((resolve, reject) => {
    auth.client.userInfo(accessToken, (err, user) => {
      if (err) {
        reject(err)
      }

      resolve(user)
    })
  })
})

Cypress.Commands.add("seal", (thingToEncrypt) => {
  return new Cypress.Promise((resolve, reject) => {
    try {
      Iron.seal(thingToEncrypt, Cypress.env("AUTH0_COOKIE_SECRET"), Iron.defaults).then((encryptedThing) => {
        resolve(encryptedThing)
      })
    } catch (error) {
      reject(error)
    }
  })
})

Cypress.Commands.add("gaiaLogin", () => {
  Cypress.log({
    name: "loginViaAuth0",
  })

  // cy.clearCookies(); // If needed

  /* https://github.com/auth0/nextjs-auth0/blob/master/src/handlers/login.ts#L70 */

  cy.setCookie("a0:state", "some-random-state", { domain: Cypress.env("GAIA_DOMAIN") })

  cy._loginTestUser().then((response) => {
    const {
      accessToken,
      expiresIn,
      idToken,
      scope,
      tokenType,
    } = response

    cy.getUserInfo(accessToken).then((user) => {

      /* https://github.com/auth0/nextjs-auth0/blob/master/src/handlers/callback.ts#L44 */
      /* https://github.com/auth0/nextjs-auth0/blob/master/src/handlers/callback.ts#L47 */
      /* https://github.com/auth0/nextjs-auth0/blob/master/src/session/cookie-store/index.ts#L57 */

      const persistedSession = {
        user,
        idToken,
        accessToken,
        accessTokenScope: scope,
        accessTokenExpiresAt: Date.now() + expiresIn,
        createdAt: Date.now(),
      }

      /* https://github.com/auth0/nextjs-auth0/blob/master/src/session/cookie-store/index.ts#L73 */

      cy.seal(persistedSession).then((encryptedSession) => {
        cy.setCookie("a0:session", encryptedSession, { domain: Cypress.env("GAIA_DOMAIN") })
      })
    })
  })
})