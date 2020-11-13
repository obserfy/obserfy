import { NextApiRequest, NextApiResponse } from "next"
import auth0 from "../../../../utils/auth0"
import logger from "../../../../logger"
import { findChildCurriculumProgress } from "../../../../db/queries"
import { getFirstQueryValue } from "../../../../utils/rest"

interface Area {
  id: string
  name: string
  subjects: Array<{
    id: string
    name: string
    materials: Array<{
      id: string
      name: string
      stage: number
    }>
  }>
}

export type GetChildProgressResponse = Area[]

const progress = auth0.requireAuthentication(
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const childId = getFirstQueryValue(req, "childId")
      const session = await auth0.getSession(req)
      if (!session) {
        res.status(401).end("unauthorized")
        return
      }

      const result = await findChildCurriculumProgress(childId)
      if (!result) {
        res.status(404).end("not found")
        return
      }

      const response: GetChildProgressResponse = result
      res.status(200).json(response)
    } catch (error) {
      logger.error(error)
      res.status(error.status || 500).end(error.message)
    }
  }
)

export default progress
