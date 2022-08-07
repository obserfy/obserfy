/* eslint-disable spaced-comment */
/// <reference types="cypress" />
/// <reference types="@types/faker" />
declare namespace Cypress {
  type CustomCommand<T extends (...args: any) => void> = (
    ...args: Parameters<T>
  ) => Chainable<Element>

  interface Chainable {
    // our custom made commands
    fixedClearCookies: () => Chainable<Element>
    registerVor: () => Chainable<Element>
    createClass: () => Chainable<Element>
    createSchool: () => Chainable<Element>
    createStudent: () => Chainable<Element>
    createGuardian: () => Chainable<Element>
    createObservation: () => Chainable<Element>
    createLessonPlan: () => Chainable<Element>
  }
}
