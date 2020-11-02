import auth0 from "../../../../utils/auth0"
import { getFirstQueryValue } from "../../../../utils/rest"
import { findChildObservationsGroupedByDate } from "../../../../db/queries"

interface Timeline {
  date: string
  observations: Array<{
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

export type GetChildTimelineResponse = Timeline[]

export default auth0.requireAuthentication(async (req, res) => {
  try {
    const childId = getFirstQueryValue(req, "childId")
    const observations = await findChildObservationsGroupedByDate(childId)

    await res.json(observations)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).end(err.message)
  }
})
