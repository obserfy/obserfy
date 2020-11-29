module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["cypress", "mocha"],
  extends: [
    "airbnb-typescript/base",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "jest/valid-expect-in-promise": 0,
    "jest/expect-expect": 0,
    "global-require": "off",
    "@typescript-eslint/no-use-before-define": ["error", { variables: false }],
    "func-names": "off",
    "mocha/no-mocha-arrows": 1,
    "no-console": 0,
  },
}
