module.exports = (on, config) => {
  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.family === "firefox") {
      // auto open devtools
      launchOptions.args.push("-devtools")
      return launchOptions
    }
  })
}
