import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import * as Sentry from "@sentry/node"
import logger from "../logger"
import { initSentry } from "./sentry"

initSentry()

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

      if (error.status > 500 || error.status === undefined) {
        res.status(500).end(error.message)
      } else {
        res.status(error.status).end(error.message)
      }
    }
  }
}

export function protectedApiRoute(handler: NextApiHandler) {
  return withApiAuthRequired(
    async (req: NextApiRequest, res: NextApiResponse) => {
      try {
        await handler(req, res)
      } catch (error) {
        logger.error(error)
        Sentry.captureException(error)

        if (error.status > 500 || error.status === undefined) {
          res.status(500).end()
        } else {
          res.status(error.status).end(error.message)
        }
      }
    }
  )
}
