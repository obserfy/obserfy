import auth0 from "../../../../utils/auth0"
import { insertObservationToPlan } from "../../../../db"

export interface PostPlanObservationRequest {
  childId: string
  observation: string
}
const childHandler = auth0.requireAuthentication(async (req, res) => {
  try {
    const session = await auth0.getSession(req)
    if (!session) {
      res.status(401).end("unauthorized")
      return
    }
    const {
      query: { planId },
    } = req

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
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
})

export default childHandler
