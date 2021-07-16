/* eslint-disable */
const babelOptions = {
  presets: [
    "@babel/preset-typescript",
    [
      "babel-preset-gatsby",
      {
        reactRuntime: "automatic",
        reactImportSource: "theme-ui",
      },
    ],
  ],
  plugins: [require.resolve("babel-plugin-remove-graphql-queries")],
}

module.exports = require("babel-jest").default.createTransformer(babelOptions)
