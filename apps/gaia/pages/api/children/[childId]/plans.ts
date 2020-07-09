import auth0 from "../../../../utils/auth0"
import { findLessonPlanByChildId } from "../../../../db"

export default auth0.requireAuthentication(async (req, res) => {
  try {
    const {
      query: { childId },
    } = req

    const plans = await findLessonPlanByChildId(childId as string)

    res.status(200).json(plans)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).end(err.message)
  }
})
