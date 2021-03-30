const SentryWebpackPlugin = require("@sentry/webpack-plugin")
const version = require("./version")

const {
  NEXT_PUBLIC_SENTRY_DSN: SENTRY_DSN,
  SENTRY_ORG,
  SENTRY_PROJECT,
  SENTRY_AUTH_TOKEN,
  NODE_ENV,
} = process.env

process.env.SENTRY_DSN = SENTRY_DSN

module.exports = {
  webpack: (config, { isServer, webpack }) => {
    // TODO: migrate to next official sentry plugin when available
    // dont use sentry node on browser
    if (!isServer) {
      // eslint-disable-next-line no-param-reassign
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
          urlPrefix: `~/_next`,
          release: version,
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
