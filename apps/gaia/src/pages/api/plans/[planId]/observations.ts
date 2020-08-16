import auth0 from "../../../../utils/auth0"
import { insertObservationToPlan } from "../../../../db"

export interface PostPlanObservationRequest {
  childId: string
  observation: string
}
const childHandler = auth0.requireAuthentication(async (req, res) => {
  try {
    const { user } = await auth0.getSession(req)
    const {
      query: { planId },
    } = req

    if (req.method === "POST") {
      const body: PostPlanObservationRequest = JSON.parse(req.body)
      await insertObservationToPlan(
        planId as string,
        user.email,
        body.childId,
        body.observation
      )
      res.status(201)
    } else {
      res.status(405)
    }
  } catch (error) {
    console.error(error)
    res.status(error.status || 500).end(error.message)
  }
})

export default childHandler
