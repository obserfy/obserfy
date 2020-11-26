import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import * as Sentry from "@sentry/node"
import logger from "../logger"
import auth0 from "./auth0"
import { sentryInit } from "./sentry"

sentryInit()

export const getFirstQueryValue = (
  req: NextApiRequest,
  key: string
): string => {
  const { query } = req
  const value = query[key]
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}

export function apiRoute(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (error) {
      logger.error(error)
      Sentry.captureException(error)
      res.status(error.status || 500).end(error.message)
    }
  }
}

export function protectedApiRoute(handler: NextApiHandler) {
  return auth0.requireAuthentication(
    async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        await handler(req, res)
      } catch (error) {
        logger.error(error)
        Sentry.captureException(error)
        res.status(error.status || 500).end(error.message)
      }
    }
  )
}
