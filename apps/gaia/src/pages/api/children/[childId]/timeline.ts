import auth0 from "../../../../utils/auth0"
import { getFirstQueryValue } from "../../../../utils/rest"
import { findChildObservationsGroupedByDate } from "../../../../db"

export interface GetChildPlansResponse {
  [date: string]: Array<{
    id: string
    shortDesc: string
    longDesc: string
    images: Array<{
      id: string
      thumbnailUrl: string
      originalImageUrl: string
    }>
  }>
}
export default auth0.requireAuthentication(async (req, res) => {
  try {
    const childId = getFirstQueryValue(req, "childId")
    const observations = findChildObservationsGroupedByDate(childId)

    res.json(observations)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).end(err.message)
  }
})
