module.exports = {
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  extends: ["next", "prettier"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        name: "dayjs",
        message:
          "Please use $lib/dayjs instead. It setups required plugins correctly.",
      },
    ],
  },
  globals: {
    document: true,
    window: true,
  },
}
