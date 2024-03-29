const { withSentryConfig } = require("@sentry/nextjs")
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
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_RELEASE: version,
  },
  images: {
    formats: ["image/webp"],
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
  experimental: {
    appDir: true,
  },
}

module.exports = (phase, defaultConfig) => {
  const config = plugins.reduce(
    (acc, plugin) => {
      const update = plugin(acc)
      return typeof update === "function"
        ? update(phase, defaultConfig)
        : update
    },
    { ...nextConfig }
  )

  return config
}
