/* eslint-disable */
const babelOptions = {
  presets: ["@babel/preset-typescript", "babel-preset-gatsby"],
  plugins: [
    require.resolve("@babel/plugin-proposal-class-properties"),
    require.resolve("@babel/plugin-proposal-optional-chaining"),
    require.resolve("@babel/plugin-proposal-nullish-coalescing-operator"),
    require.resolve("@babel/plugin-proposal-numeric-separator"),
    require.resolve("babel-plugin-remove-graphql-queries")
  ]
}

module.exports = require("babel-jest").createTransformer(babelOptions)
