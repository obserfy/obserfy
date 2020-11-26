// next.config.js
const withSourceMaps = require("@zeit/next-source-maps")()
const withPlugins = require("next-compose-plugins")
const optimizedImages = require("next-optimized-images")
const withPrefresh = require("@prefresh/next")
const withPWA = require("next-pwa")
const preact = require("preact")
const runtimeCaching = require("./sw-cache.js")
const fs = require("fs")

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
    buildExcludes: [/.*images.*$/],
    runtimeCaching,
  },
}

module.exports = withPlugins([
    [withPWA, pwaConfig],
    withPrefresh,
    optimizedImages,
    withSourceMaps,
  ],
  {
    env: {
      // Make the COMMIT_SHA available to the client so that Sentry events can be
      // marked for the release the belong to. It may be undefined if running
      // outside of Vercel
      NEXT_PUBLIC_RELEASE: release,
    },
    images: {
      domains: [process.env.NEXT_OPTIMIZED_IMG_DOMAIN || "media.obserfy.com"],
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
          "process.env.NEXT_IS_SERVER": JSON.stringify(
            isServer.toString(),
          ),
        }),
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
          }),
        )
      }

      // TODO: migrate to next-preact-plugin in the future.
      const splitChunks = config.optimization && config.optimization.splitChunks
      if (splitChunks) {
        const cacheGroups = splitChunks.cacheGroups
        const preactModules = /[\\/]node_modules[\\/](preact|preact-render-to-string|preact-context-provider)[\\/]/
        if (cacheGroups.framework) {
          cacheGroups.preact = Object.assign({}, cacheGroups.framework, {
            test: preactModules,
          })
          cacheGroups.commons.name = "framework"
        } else {
          cacheGroups.preact = {
            name: "commons",
            chunks: "all",
            test: preactModules,
          }
        }
      }

      // Install webpack aliases:
      const aliases = config.resolve.alias || (config.resolve.alias = {})
      aliases.react = aliases["react-dom"] = "preact/compat"

      if (dev) {
        if (isServer) {
          // Remove circular `__self` and `__source` props only meant for
          // development. See https://github.com/developit/nextjs-preact-demo/issues/25
          let oldVNodeHook = preact.options.vnode
          preact.options.vnode = (vnode) => {
            const props = vnode.props
            if (props != null) {
              if ("__self" in props) props.__self = null
              if ("__source" in props) props.__source = null
            }

            if (oldVNodeHook) {
              oldVNodeHook(vnode)
            }
          }
        } else {
          // inject Preact DevTools
          const entry = config.entry
          config.entry = () =>
            entry().then((entries) => {
              entries["main.js"] = ["preact/debug"].concat(
                entries["main.js"] || [],
              )
              return entries
            })
        }
      }

      return config
    },
  },
)
