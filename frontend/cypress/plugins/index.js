/* eslint-disable @typescript-eslint/no-var-requires,global-require,import/no-extraneous-dependencies */
const cypressTypeScriptPreprocessor = require("./cy-ts-preprocessor")

module.exports = (on) => {
  on("task", require("@cypress/code-coverage/task"))
  on(
    "file:preprocessor",
    require("@cypress/code-coverage/use-browserify-istanbul")
  )
  on("file:preprocessor", cypressTypeScriptPreprocessor)
}
