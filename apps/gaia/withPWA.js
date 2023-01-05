const runtimeCaching = require("./sw-cache.js")

module.exports = require("next-pwa")({
  disable: process.env.NODE_ENV !== "production",
  dest: "public",
  buildExcludes: [/.*/],
  publicExcludes: ["!**/*"],
  runtimeCaching,
})
