const { withSentryConfig } = require("@sentry/nextjs")
const withPlugins = require("next-compose-plugins")
const withPreact = require("next-plugin-preact")
const withPWA = require("./withPWA")
const version = require("./version")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const plugins = [withPreact, withBundleAnalyzer]
if (process.env.NODE_ENV === "production") {
  plugins.push(withPWA)
  plugins.push(withSentryConfig)
}

const config = {
  swcMinify: true,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_RELEASE: version,
  },
  images: {
    domains: [
      process.env.NEXT_OPTIMIZED_IMG_DOMAIN || "media.obserfy.com",
      "image.mux.com",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
    ignoreBuildErrors: true,
  },
}

module.exports = withPlugins(plugins, config)
