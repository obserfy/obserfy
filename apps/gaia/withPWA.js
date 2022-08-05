const withPWA = require("next-pwa")
const runtimeCaching = require("./sw-cache.js")

const pwaConfig = {
  pwa: {
    disable: process.env.NODE_ENV !== "production",
    dest: "public",
    buildExcludes: [/.*/],
    publicExcludes: ["!**/*"],
    runtimeCaching,
  },
}

module.exports = [withPWA, pwaConfig]
