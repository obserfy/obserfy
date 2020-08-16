/* eslint-disable @typescript-eslint/no-var-requires,global-require,import/no-extraneous-dependencies */
module.exports = (on, config) => {
  on("task", require("@cypress/code-coverage/task")(on, config))
  return config
}
