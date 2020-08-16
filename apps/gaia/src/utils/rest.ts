import { NextApiRequest } from "next"

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
