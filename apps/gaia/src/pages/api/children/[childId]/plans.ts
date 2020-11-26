import { findLessonPlanByChildIdAndDate } from "../../../../db/queries"
import { getFirstQueryValue, protectedApiRoute } from "../../../../utils/rest"
import { Dayjs } from "../../../../utils/dayjs"

export interface GetChildPlansResponse {
  id: string
  title: string
  description: string
  date: Dayjs
  area?: {
    id: string
    name: string
  }
  links: Array<{
    id: string
    url: string
    title?: string
    description?: string
    image?: string
  }>
  observations: Array<{
    id: string
    observation: string
    createdAt: string
  }>
}
const childPlans = protectedApiRoute(async (req, res) => {
  const date = getFirstQueryValue(req, "date")
  const childId = getFirstQueryValue(req, "childId")

  const plans: GetChildPlansResponse[] = await findLessonPlanByChildIdAndDate(
    childId as string,
    date
  )

  res.json(plans)
})

export default childPlans
