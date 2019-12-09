module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  plugins: ["@typescript-eslint", "react-hooks", "jest", "prettier", "markdown"],
  overrides: [
    {
      "files": ["*.md"],
      "rules": {
        "prettier/prettier": [
          2,
          {
            // unnecessary if you're not using `eslint-plugin-prettier`, but required if you are
            "parser": "markdown"
          }
        ]
      }
    },
    {
      "files": ["*.mdx", ".md"],
      "extends": ["plugin:mdx/overrides"],
      rules: {
        "no-unused-expressions": "off",
        "react/jsx-filename-extension": 0
      }
    }
  ],
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:mdx/recommended",
    "airbnb",
    "prettier",
    "prettier/react",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    "plugin:jest/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: "module" // Allows for the use of imports
  },
  env: {
    "jest/globals": true
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    "no-undef": 0,
    "react/prop-types": 0,
    "react/style-prop-object": 0,
    "react/jsx-props-no-spreading": 0,
    "react/jsx-filename-extension": [1, { extensions: [".tsx"] }],
    "jest/no-mocks-import": 0,

    // Needed cause, https://github.com/typescript-eslint/typescript-eslint/issues/493
    // TODO: Remove on typescript-eslint 2.0
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      {
        allowTypedFunctionExpressions: true,
        allowExpressions: true
      }
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
          "**/*.spec.js"
        ]
      }
    ],
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies

    // prevents bug on eslint causing error on class constructor with no body
    // on .d.ts files
    "no-useless-constructor": "off",
    "@typescript-eslint/no-useless-constructor": "error",
    "import/prefer-default-export": 0,
    "no-unused-expressions": "off",
    "mdx/no-unused-expressions": "off",
  },
  settings: {
    react: {
      version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    // Force eslint to analyse tsx (it analyse only js by default
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"]
      }
    },
    "import/ignore": [".svg$"]
  },
  globals: {
    document: true,
    window: true
  },
}
