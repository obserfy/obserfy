import { getFirstQueryValue, protectedApiRoute } from "../../../../utils/rest"
import { getChildObservationByImage } from "../../../../db/queries"

export interface GetChildObservationByImages {
  id: string
  longDesc: string
  shortDesc: string
  createdAt: string
  eventTime: string
}

const getImage = protectedApiRoute(async (req, res) => {
  try {
    const imageId = getFirstQueryValue(req, "imageId")
    const observations = await getChildObservationByImage(imageId)

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

export default getImage
