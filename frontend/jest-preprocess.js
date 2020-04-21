/* eslint-disable */
const babelOptions = {
  presets: ["@babel/preset-typescript", "babel-preset-gatsby"],
  plugins: [
    require.resolve("babel-plugin-remove-graphql-queries"),
  ],
}

module.exports = require("babel-jest").createTransformer(babelOptions)
