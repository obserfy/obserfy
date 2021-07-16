const path = require("path")
const pathToInlineSvg = path.resolve(__dirname, "../src/icons/")

module.exports = {
  core: {
    builder: "webpack5",
  },
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

    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]

    return config
  },
}
