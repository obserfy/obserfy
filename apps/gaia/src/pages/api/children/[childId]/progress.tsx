import { findChildCurriculumProgress } from "../../../../db/queries"
import { getFirstQueryValue, protectedApiRoute } from "../../../../utils/rest"

interface Area {
  id: string
  name: string
  subjects: Array<{
    id: string
    name: string
    materials: Array<{
      id: string
      name: string
      order: number
      stage: number
    }>
  }>
}

export type GetChildProgressResponse = Area[]

const progress = protectedApiRoute(async (req, res) => {
  const childId = getFirstQueryValue(req, "childId")

  const result = await findChildCurriculumProgress(childId)
  if (!result) {
    res.status(404).end("not found")
    return
  }

  const response: GetChildProgressResponse = result
  res.json(response)
})

export default progress
