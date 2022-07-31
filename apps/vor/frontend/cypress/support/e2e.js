/* eslint-disable */
// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the id of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
require("./commands")

// Alternatively you can use CommonJS syntax:
// require('./commands')
// require("@cypress/code-coverage/support")
//
// runs everytime we hot reload app, disabled cause it also got triggered when cypress hot reload
// Cypress.on("window:before:load", (window) => {
//   const { XMLHttpRequest } = window
//   const originalOpen = XMLHttpRequest.prototype.open
//   XMLHttpRequest.prototype.open = function open(...args) {
//     this.addEventListener("load", function load() {
//       if (this.url.endsWith("hot-update.json")) {
//         cy.$$(".stop", window.top.document).click()
//         cy.$$(".restart", window.top.document).click()
//       }
//     })
//     originalOpen.apply(this, args)
//   }
// })
beforeEach(() => {
  Cypress.on("uncaught:exception", (err, runnable, promise) => {
    // when the exception originated from an unhandled promise
    // rejection, the promise is provided as a third argument
    // you can turn off failing the test in this case
    if (promise) {
      // returning false here prevents Cypress from
      // failing the test
      return false
    }
  })
})
