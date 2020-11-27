/* eslint-disable @typescript-eslint/no-var-requires,global-require,import/no-extraneous-dependencies */
const webpackPreprocessor = require("@cypress/webpack-preprocessor")
const PnpWebpackPlugin = require("pnp-webpack-plugin")

module.exports = (on, config) => {
  // on("task", require("@cypress/code-coverage/task")(on, config))
  const options = webpackPreprocessor.defaultOptions
  options.webpackOptions.resolve = { plugins: [PnpWebpackPlugin] }
  options.webpackOptions.resolveLoader = {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  }
  on("file:preprocessor", webpackPreprocessor(options))
  return config
}
