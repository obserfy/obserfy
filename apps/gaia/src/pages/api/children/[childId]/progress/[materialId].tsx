import { findMaterialDetailsByChildId } from "../../../../../db/queries"
import {
  getFirstQueryValue,
  protectedApiRoute,
} from "../../../../../utils/rest"

export interface GetMaterialProgressDetailResponse {
  id: string
  name: string
  description: string | null
  stage: string
}

const progress = protectedApiRoute(async (req, res) => {
  const childId = getFirstQueryValue(req, "childId")
  const materialId = getFirstQueryValue(req, "materialId")

  const result = await findMaterialDetailsByChildId(childId, materialId)
  if (!result || !result[0]) {
    res.status(404).end("not found")
    return
  }

  const response: GetMaterialProgressDetailResponse = result[0]
  res.json(response)
})

export default progress
