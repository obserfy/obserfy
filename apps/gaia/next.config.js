const { withSentryConfig } = require("@sentry/nextjs")
const withPlugins = require("next-compose-plugins")
const withPWA = require("./withPWA")
const version = require("./version")
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const plugins = [withBundleAnalyzer]
if (process.env.NODE_ENV === "production") {
  plugins.push(withPWA)
  plugins.push(withSentryConfig)
}

/** @type {import("next").NextConfig}*/
const config = {
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_RELEASE: version,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: [
      process.env.NEXT_OPTIMIZED_IMG_DOMAIN || "media.obserfy.com",
      "image.mux.com",
      "roci",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = withPlugins(plugins, config)
