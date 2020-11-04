import auth0 from "../../../../utils/auth0"
import { getFirstQueryValue } from "../../../../utils/rest"
import { getChildObservationByImages } from "../../../../db"

export interface GetChildObservationByImages {
  id: string
  longDesc: string
  shortDesc: string
  createdAt: string
  eventTime: string
}

export default auth0.requireAuthentication(async (req, res) => {
  try {
    const imageId = getFirstQueryValue(req, "imageId")
    const observations = await getChildObservationByImages(imageId)

    if (!observations) {
      res.status(404).end("not found")
      return
    }

    const response: GetChildObservationByImages[] = observations.map((obv) => ({
      id: obv.id,
      longDesc: obv.long_desc,
      shortDesc: obv.short_desc,
      createdAt: obv.created_date,
      eventTime: obv.event_time,
    }))

    res.json(response)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).end(err.message)
  }
})