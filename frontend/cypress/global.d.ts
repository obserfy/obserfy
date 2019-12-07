// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    // cypress-axe custom commands
    injectAxe(): Chainable<object>
    checkA11y(): Chainable<object>

    // gatsby-cypress custom commands
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    waitForRouteChange(): Chainable<any>
  }
}
