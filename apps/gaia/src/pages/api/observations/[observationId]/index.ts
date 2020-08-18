import { NextApiRequest, NextApiResponse } from "next"
import auth0 from "../../../../utils/auth0"
import { deleteObservation, updateObservation } from "../../../../db"

export interface PatchObservationRequestBody {
  observation: string
}
const handlePatch = async (
  res: NextApiResponse,
  req: NextApiRequest,
  user: any,
  observationId: string
) => {
  const body: PatchObservationRequestBody = JSON.parse(req.body)
  const result = await updateObservation(observationId, body.observation)
  if (result > 0) {
    res.status(200).end()
    return
  }
  res.status(404).end()
}

const handleDelete = async (
  res: NextApiResponse,
  req: NextApiRequest,
  observationId: string
) => {
  const result = await deleteObservation(observationId)
  if (result > 0) {
    res.status(200).end()
    return
  }
  res.status(404).end()
}

const observationHandler = auth0.requireAuthentication(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = await auth0.getSession(req)
    const {
      query: { observationId },
    } = req

    try {
      if (req.method === "PATCH") {
        await handlePatch(res, req, user, observationId as string)
      } else if (req.method === "DELETE") {
        await handleDelete(res, req, observationId as string)
      } else {
        res.status(405)
      }
    } catch (error) {
      console.error(error)
      res.status(error.status || 500).end(error.message)
    }
  }
)

export default observationHandler
