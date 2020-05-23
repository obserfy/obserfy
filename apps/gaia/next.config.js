// next.config.js
const withPlugins = require("next-compose-plugins")
const optimizedImages = require("next-optimized-images")
const PreactRefreshPlugin = require(`@prefresh/webpack`)

module.exports = withPlugins([optimizedImages], {
  experimental: {
    modern: true,
    polyfillsOptimization: true,
  },

  webpack(config, { dev, isServer }) {
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

    // inject Preact DevTools
    if (dev && !isServer) {
      const entry = config.entry
      config.entry = () =>
        entry().then((entries) => {
          entries["main.js"] = ["preact/debug"].concat(entries["main.js"] || [])
          return entries
        })
      config.plugins.unshift(new PreactRefreshPlugin())
      config.plugins = config.plugins.filter(
        (plugin) => plugin.constructor.name !== `ReactFreshWebpackPlugin`
      )
    }

    return config
  },
})
