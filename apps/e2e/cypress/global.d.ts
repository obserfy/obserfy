/* eslint-disable spaced-comment */
/// <reference types="cypress" />
/// <reference types="@types/faker" />
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
