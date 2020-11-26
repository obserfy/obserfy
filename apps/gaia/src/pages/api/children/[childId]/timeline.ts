import { isFilled } from "ts-is-present"
import { getFirstQueryValue, protectedApiRoute } from "../../../../utils/rest"
import { findChildObservationsGroupedByDate } from "../../../../db/queries"
import { generateOriginalUrl, generateUrl } from "../../../../utils/imgproxy"

interface Timeline {
  date: string
  observations: Array<{
    id: string
    shortDesc: string
    longDesc: string
    areaName: string
    images: Array<{
      id: string
      thumbnailUrl: string
      originalImageUrl: string
    }>
  }>
}

export type GetChildTimelineResponse = Timeline[]

const timeline = protectedApiRoute(async (req, res) => {
  const childId = getFirstQueryValue(req, "childId")
  const result = await findChildObservationsGroupedByDate(childId)

  const response: GetChildTimelineResponse = result.map(
    ({ date, observations }) => ({
      date: date.toISOString(),
      observations: observations.map(
        ({ id, long_desc, short_desc, images, area_name }) => ({
          id,
          shortDesc: short_desc,
          longDesc: long_desc ?? "",
          areaName: area_name ?? "",
          images: images
            .filter(isFilled)
            .map(({ id: imageId, object_key }) => ({
              id: imageId,
              thumbnailUrl: generateUrl(object_key, 100, 100),
              originalImageUrl: generateOriginalUrl(object_key),
            })),
        })
      ),
    })
  )

  await res.json(response)
})

export default timeline
