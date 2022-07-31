import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import * as Sentry from "@sentry/nextjs"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"
import logger from "../logger"

export const getFirstQueryValue = (
  req: NextApiRequest,
  key: string
): string => {
  const { query } = req
  const value = query[key]
  if (Array.isArray(value)) {
    return value[0]
  }
  return value ?? ""
}

export function apiRoute(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error)
        Sentry.captureException(error)
        res.status(500).end(error.message)
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
        if (error instanceof Error) {
          logger.error(error)
          Sentry.captureException(error)
          res.status(500).end(error.message)
        }
      }
    }
  )
}
