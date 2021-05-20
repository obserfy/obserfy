const withPlugins = require("next-compose-plugins")
const withPreact = require("next-plugin-preact")
const withPWA = require("./withPWA")
const withSentry = require("./withSentry")
const version = require("./version")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const plugins = [withPWA, withPreact, withSentry, withBundleAnalyzer]

const config = {
  env: {
    NEXT_PUBLIC_RELEASE: version,
  },
  images: {
    domains: [
      process.env.NEXT_OPTIMIZED_IMG_DOMAIN || "media.obserfy.com",
      "image.mux.com",
    ],
  },
}

module.exports = withPlugins(plugins, config)
