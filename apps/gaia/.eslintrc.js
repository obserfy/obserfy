module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  settings: {
    "import/resolver": {
      typescript: {},
    },
  },
  plugins: ["tailwindcss", "import"],
  extends: [
    "plugin:@next/next/recommended",
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:prettier/recommended",
    "plugin:tailwindcss/recommended",
  ],
  overrides: [
    {
      // turn off no-new for miragejs use in storybook.
      files: ["*.stories.tsx"],
      rules: { "no-new": "off" },
    },
  ],
  rules: {
    "global-require": 0,
    "react/button-has-type": 0,
    "no-undef": 0,
    "react/prop-types": 0,
    "react/style-prop-object": 0,
    "react/jsx-props-no-spreading": 0,
    "jsx-a11y/anchor-is-valid": 0,
    // node-mocks-http uses dangling
    "no-underscore-dangle": 0,
    // Recommended for immer.
    "no-param-reassign": [
      "error",
      { props: true, ignorePropertyModificationsFor: ["draft"] },
    ],
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: [
          "webpack.config.prod.js",
          "webpack.config.js",
          "**/*.mdx",
          "**/setupTests.ts",
          "**/utils/mockGenerator.ts",
          "**/*stories.tsx",
          "**/*.test.tsx",
          "**/*.test.ts",
          "**/*.spec.js",
          "**/*.spec.ts",
        ],
      },
    ],
    "import/no-named-as-default": "off",
    "import/no-cycle": "off",
    "import/extensions": "off",
    "import/prefer-default-export": 0,
    "no-unused-expressions": "off",
    "react/jsx-fragments": "off",
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/no-use-before-define": ["error", { variables: false }],
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
