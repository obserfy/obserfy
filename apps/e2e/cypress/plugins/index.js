/* eslint-disable @typescript-eslint/no-var-requires,global-require,import/no-extraneous-dependencies */
const webpackPreprocessor = require("@cypress/webpack-preprocessor")
const PnpWebpackPlugin = require("pnp-webpack-plugin")

module.exports = (on) => {
  // on("task", require("@cypress/code-coverage/task")(on, config))
  const options = {
    webpackOptions: {
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: [
              {
                loader: "ts-loader",
                options: {
                  transpileOnly: true,
                },
              },
            ],
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: [".tsx", ".ts", ".js"],
        plugins: [PnpWebpackPlugin],
      },
      resolveLoader: {
        plugins: [PnpWebpackPlugin.moduleLoader(module)],
      },
    },
  }
  on("file:preprocessor", webpackPreprocessor(options))
}
