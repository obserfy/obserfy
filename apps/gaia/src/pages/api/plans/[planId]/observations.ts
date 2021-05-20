import { getSession } from "@auth0/nextjs-auth0"
import { insertObservationToPlan } from "../../../../db/queries"
import { protectedApiRoute } from "../../../../utils/rest"

export interface PostPlanObservationRequest {
  childId: string
  observation: string
}

const observation = protectedApiRoute(async (req, res) => {
  const session = await getSession(req, res)
  if (!session) {
    res.status(401).end("unauthorized")
    return
  }
  const { planId } = req.query
  if (req.method === "POST") {
    const body: PostPlanObservationRequest = JSON.parse(req.body)
    await insertObservationToPlan(
      planId as string,
      session.user.email,
      body.childId,
      body.observation
    )
    res.status(201).end()
  } else {
    res.status(405).end()
  }
})

export default observation
