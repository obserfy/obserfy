/* eslint-disable spaced-comment */
/// <reference types="cypress" />
/// <reference types="@types/faker" />

declare namespace Cypress {
  interface Chainable<> {
    // cypress-axe custom commands
    injectAxe(): Chainable<object>
    checkA11y(): Chainable<object>

    // gatsby-cypress custom commands
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    waitForRouteChange(): Chainable<any>
  }
}
