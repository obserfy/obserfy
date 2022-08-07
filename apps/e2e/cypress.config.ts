import { defineConfig } from "cypress"

export default defineConfig({
  blockHosts: [
    "*segment.com",
    "*segment.io",
    "*sentry.io",
    "*sentry.com",
    "api.mixpanel.com",
  ],
  projectId: "bs4um5",
  viewportHeight: 667,
  viewportWidth: 375,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config)
    },
    baseUrl: "http://localhost:8001",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
})
