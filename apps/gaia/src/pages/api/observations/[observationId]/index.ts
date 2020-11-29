import { NextApiRequest, NextApiResponse } from "next"
import auth0 from "../../../../utils/auth0"
import { deleteObservation, updateObservation } from "../../../../db/queries"
import { protectedApiRoute } from "../../../../utils/rest"

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

const observationHandler = protectedApiRoute(async (req, res) => {
  const session = await auth0.getSession(req)
  if (!session) {
    res.status(401).end("unauthorized")
    return
  }

  const { observationId } = req.query

  if (req.method === "PATCH") {
    await handlePatch(res, req, session.user, observationId as string)
  } else if (req.method === "DELETE") {
    await handleDelete(res, req, observationId as string)
  } else {
    res.status(405)
  }
})

export default observationHandler
