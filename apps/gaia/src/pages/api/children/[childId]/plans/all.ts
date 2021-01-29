import { findChildLessonPlans } from "../../../../../db/queries"
import {
  getFirstQueryValue,
  protectedApiRoute,
} from "../../../../../utils/rest"

export interface GetChildPlansResponse {
  id: string
  title: string
  repetitionType: string
  startDate: string
  endDate: string
  area?: {
    id: string
    name: string
  }
}
const childPlans = protectedApiRoute(async (req, res) => {
  const childId = getFirstQueryValue(req, "childId")

  const plans: GetChildPlansResponse[] = await findChildLessonPlans(
    childId as string
  )

  res.json(plans)
})

export default childPlans
