import { findMaterialDetailsByChildId } from "../../../../../db/queries"
import {
  getFirstQueryValue,
  protectedApiRoute,
} from "../../../../../utils/rest"

interface GetMaterialProgressDetailResponse {
  id: string
  name: string
  description: string
  stage: number
}

const progress = protectedApiRoute(async (req, res) => {
  const childId = getFirstQueryValue(req, "childId")
  const materialId = getFirstQueryValue(req, "childId")

  const result = await findMaterialDetailsByChildId(childId, materialId)
  if (!result) {
    res.status(404).end("not found")
    return
  }

  const response: GetMaterialProgressDetailResponse = result
  res.json(response)
})

export default progress
