import pino from "pino"

const logger = pino({
  prettyPrint: process.env.NODE_ENV === "dev" ? { colorize: true } : false,
})

export default logger
