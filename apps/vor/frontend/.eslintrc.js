module.exports = {
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  extends: [
    "react-app",
    "plugin:prettier/recommended",
    "plugin:tailwindcss/recommended",
    "plugin:jest/recommended",
  ],
  plugins: ["jest", "tailwindcss"],
  env: { "jest/globals": true },
  rules: {
    "no-restricted-imports": [
      "error",
      {
        name: "dayjs",
        message:
          "Please use ./src/dayjs instead. It setups required plugins correctly.",
      },
    ],
  },
  globals: {
    document: true,
    window: true,
  },
}
