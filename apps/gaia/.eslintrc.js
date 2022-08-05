module.exports = {
  plugins: ["tailwindcss"],
  extends: [
    "next/core-web-vitals",
    "plugin:prettier/recommended",
    "plugin:tailwindcss/recommended",
  ],
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
