/// <reference types="cypress" />
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
     */
    clearSW(): Chainable<Element>
    visitVor(path: string): Chainable<Element>
    visitGaia(path: string): Chainable<Element>
    fixedClearCookies(): Chainable<Element>
  }
}

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
