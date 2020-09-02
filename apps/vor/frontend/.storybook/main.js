const path = require("path")
const pathToInlineSvg = path.resolve(__dirname, "../src/icons/")

module.exports = {
  stories: ["../src/**/*.stories.tsx"],
  addons: ["@storybook/addon-essentials"],
  webpackFinal: async (config) => {
    // Handle SVG Import
    const rules = config.module.rules
    // modify storybook's file-loader rule to avoid conflicts with svgr
    const fileLoaderRule = rules.find((rule) => {
      if (rule && rule.test && rule.test.test) {
        return rule.test.test(".svg")
      }
      return false
    })
    fileLoaderRule.exclude = [pathToInlineSvg]
    rules.push({
      test: /\.svg$/,
      include: path.resolve(__dirname, "../src"),
      use: ["@svgr/webpack", "url-loader"],
    })

    // Make Storybook plays well with gatsby =======================================
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]

    // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
    config.resolve.mainFields = ["browser", "module", "main"]

    // Webpack can't find gatsby package since the node_modules is now located at
    // the root of the project. The line below is added so that packages inside
    // node_modules is now included by webpack.
    config.module.rules[0].include = path.resolve(__dirname, "../../../../")

    return config
  },
}
