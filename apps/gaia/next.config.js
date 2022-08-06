const { withSentryConfig } = require("@sentry/nextjs")
const withPlugins = require("next-compose-plugins")
const withPWA = require("./withPWA")
const version = require("./version")

const plugins = []
if (process.env.NODE_ENV === "production") {
  plugins.push(withPWA)
  plugins.push(withSentryConfig)
}

if (process.env.ANALYZE === "true") {
  plugins.push(require("@next/bundle-analyzer")())
}

/** @type {import("next").NextConfig}*/
const config = {
  reactStrictMode: true,
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
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
  publicRuntimeConfig: {
    imgproxyUrl: process.env.IMGPROXY_URL,
  },
}

module.exports = withPlugins(plugins, config)
