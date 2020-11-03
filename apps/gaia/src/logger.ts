import pino from "pino"

const logger = pino({
  prettyPrint:
    process.env.NODE_ENV === "development" ? { colorize: true } : false,
})

export default logger
