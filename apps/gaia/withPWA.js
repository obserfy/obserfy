const withPWA = require("next-pwa")
const runtimeCaching = require("./sw-cache.js")

const pwaConfig = {
  pwa: {
    disable: process.env.NODE_ENV !== "production",
    dest: "public",
    publicExcludes: [
      "!icons/**/*",
      "!images/**/*",
      "!google-fonts/**/*",
      "!shortcuts/**/*",
    ],
    buildExcludes: [/.*\.map$/],
    runtimeCaching,
  },
}

module.exports = [withPWA, pwaConfig]
