const path = require("path")
const webpack = require("webpack")
// 1. import default from the plugin module
// const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;

// 2. create a transformer;
// the factory additionally accepts an options object which described below
// const styledComponentsTransformer = createStyledComponentsTransformer();

// 3. add getCustomTransformer method to the loader config
const pathToInlineSvg = path.resolve(__dirname, "../src/icons/")
module.exports = ({ config }) => {
  // Config for parsing typescript=================================================
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: path.resolve(__dirname, "../src"),
    use: [
      {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-typescript"],
          plugins: [require.resolve("babel-plugin-remove-graphql-queries")],
        },
      },
    ],
  })

  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: path.resolve(__dirname, "../src/components"),
    use: [require.resolve("react-docgen-typescript-loader")],
  })

  // Handle SVGR
  const rules = config.module.rules
  // modify storybook's file-loader rule to avoid conflicts with svgr
  const fileLoaderRule = rules.find((rule) => rule.test.test(".svg"))
  fileLoaderRule.exclude = [pathToInlineSvg]
  rules.push({
    test: /\.svg$/,
    include: path.resolve(__dirname, "../src"),
    use: [
      {
        loader: "@svgr/webpack",
        options: {
          prettier: true, // use prettier to format JS code output (default)
          svgo: true, // use svgo to optimize SVGs (default)
          svgoConfig: {
            removeViewBox: true, // remove viewBox when possible (default)
            cleanupIDs: true, // remove unused IDs and minify remaining IDs (default)
          },
        },
      },
      "url-loader",
    ],
  })

  // Speed up storybook compilation===============================================
  config.optimization = {
    ...config.optimization,
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  }
  config.output = {
    ...config.output,
    pathinfo: false,
  }
  config.resolve.extensions.push(".ts", ".tsx")

  // Make Storybook plays well with gatsby =======================================
  // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
  config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]

  // We already added this above
  // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
  // config.module.rules[0].use[0].loader = require.resolve("babel-loader");

  // We already added this above
  // use @babel/preset-react for JSX and env (instead of staged presets)
  // config.module.rules[0].use[0].options.presets = [
  //   require.resolve("@babel/preset-react"),
  //   require.resolve("@babel/preset-env")
  // ];

  // Already added above too.
  // use @babel/plugin-proposal-class-properties for class arrow functions
  // config.module.rules[0].use[0].options.plugins = [
  //   require.resolve("@babel/plugin-proposal-class-properties")
  // ];

  // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
  config.resolve.mainFields = ["browser", "module", "main"]

  // Mock gatsby-plugin-intl Link component.
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /gatsby-plugin-intl3/,
      path.resolve(__dirname, "./gatsby-plugin-intl3-mock.ts")
    )
  )

  return config
}
