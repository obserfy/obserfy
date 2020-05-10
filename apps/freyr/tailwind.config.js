// tailwind.config.js
const toTailwind = require("@theme-ui/tailwind")
const theme = require("design-tokens") // Path to Theme UI config

module.exports = {
  important: true,
  theme: {
    fontFamily: {
      heading: ["Crimson Text"],
      body: ["Open Sans"]
    }
  }
}
