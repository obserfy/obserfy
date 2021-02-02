import { isPresent } from "ts-is-present"
import { findLessonPlanById } from "../../../../db/queries"
import { protectedApiRoute } from "../../../../utils/rest"

export interface GetLessonPlanResponse {
  id: string
  title: string
  areaName: string
  description: string
  endDate: string
  links: Array<{ id: string; url: string }>
  repetitionType: string
  startDate: string
}
const handleLessonPlan = protectedApiRoute(async (req, res) => {
  const { planId } = req.query

  if (req.method === "GET") {
    const plan = await findLessonPlanById(planId as string)
    if (plan) {
      const response: GetLessonPlanResponse = {
        id: plan.id,
        title: plan.title,
        description: plan.description ?? "",
        links: plan.links.filter(isPresent),
        areaName: plan.area_name ?? "",
        endDate: plan.end_date.toISOString(),
        startDate: plan.start_date.toISOString(),
        repetitionType: plan.repetition_type,
      }
      return res.json(response)
    }
    return res.status(404).end()
  }
  return res.status(405).end()
})

export default handleLessonPlan
