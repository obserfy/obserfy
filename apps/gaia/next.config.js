const withSourceMaps = require("@zeit/next-source-maps")()
const withPlugins = require("next-compose-plugins")
const withPWA = require("next-pwa")
const withPreact = require("next-plugin-preact")
const fs = require("fs")

const runtimeCaching = require("./sw-cache.js")

// Sentry data
const SentryWebpackPlugin = require("@sentry/webpack-plugin")
const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
} = process.env

process.env.SENTRY_DSN = SENTRY_DSN
const basePath = ""
const release = fs.readFileSync("../../VERSION", "UTF-8")

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

module.exports = withPlugins(
  [[withPWA, pwaConfig], withPreact, withSourceMaps],
  {
    env: {
      // Make the COMMIT_SHA available to the client so that Sentry events can be
      // marked for the release the belong to. It may be undefined if running
      // outside of Vercel
      NEXT_PUBLIC_RELEASE: release,
    },
    images: {
      domains: [
        process.env.NEXT_OPTIMIZED_IMG_DOMAIN || "media.obserfy.com",
        "image.mux.com",
      ],
    },
    experimental: {
      modern: true,
      polyfillsOptimization: true,
    },
    webpack: (config, { dev, isServer, webpack }) => {
      // TODO: migrate to next official sentry plugin when available
      // dont use sentry node on browser
      if (!isServer) {
        config.resolve.alias["@sentry/node"] = "@sentry/browser"
      }
      // Define an environment variable so source code can check whether or not
      // it's running on the server so we can correctly initialize Sentry
      config.plugins.push(
        new webpack.DefinePlugin({
          "process.env.NEXT_IS_SERVER": JSON.stringify(isServer.toString()),
        })
      )
      // When all the Sentry configuration env variables are available/configured
      // The Sentry webpack plugin gets pushed to the webpack plugins to build
      // and upload the source maps to sentry.
      // This is an alternative to manually uploading the source maps
      // Note: This is disabled in development mode.
      if (
        SENTRY_DSN &&
        SENTRY_ORG &&
        SENTRY_PROJECT &&
        SENTRY_AUTH_TOKEN &&
        NODE_ENV === "production"
      ) {
        config.plugins.push(
          new SentryWebpackPlugin({
            include: ".next",
            ignore: ["node_modules"],
            stripPrefix: ["webpack://_N_E/"],
            urlPrefix: `~${basePath}/_next`,
            release: release,
          })
        )
      }

      // support svg component
      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      })

      return config
    },
  }
)
