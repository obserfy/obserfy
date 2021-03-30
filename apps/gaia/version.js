const fs = require("fs")

const version = fs.readFileSync("../../VERSION", "UTF-8")

module.exports = version
