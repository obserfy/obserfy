module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["cypress"],
  extends: [
    "airbnb-typescript",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
    "prettier/react",
  ],
  rules: {
    "jest/valid-expect-in-promise": 0,
    "jest/expect-expect": 0,
    "global-require": "off",
  },
}
