import { isPresent } from "ts-is-present"
import { findLessonPlanById } from "../../../../db/queries"
import { protectedApiRoute } from "../../../../utils/rest"

export interface GetLessonPlanResponse {
  id: string
  title: string
  areaName: string
  description: string
  endDate: string
  links: string[]
  repetitionType: string
  startDate: string
}
const handleLessonPlan = protectedApiRoute(async (req, res) => {
  const { planId } = req.query

  if (req.method === "GET") {
    const plan = await findLessonPlanById(planId as string)
    if (plan.length === 0) {
      return res.status(404).end()
    }

    const response: GetLessonPlanResponse = {
      id: plan[0].id,
      title: plan[0].title,
      description: plan[0].description ?? "",
      links: plan[0].links.filter(isPresent),
      areaName: plan[0].area_name ?? "",
      endDate: plan[0].end_date.toISOString(),
      startDate: plan[0].start_date.toISOString(),
      repetitionType: plan[0].repetition_type,
    }
    res.json(response)
  } else {
    res.status(405).end()
  }
})

export default handleLessonPlan
