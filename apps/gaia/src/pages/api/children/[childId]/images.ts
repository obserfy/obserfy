import { getFirstQueryValue, protectedApiRoute } from "../../../../utils/rest"
import { getChildImages } from "../../../../db/queries"
import { generateOriginalUrl, generateUrl } from "../../../../utils/imgproxy"

export interface GetChildImagesResponse {
  id: string
  imageUrl: string
  originalImageUrl: string
  createdAt: string
}
const getChildImage = protectedApiRoute(async (req, res) => {
  const childId = getFirstQueryValue(req, "childId")
  const images = await getChildImages(childId as string)

  if (!images) {
    res.status(404).end("not found")
    return
  }

  const response: GetChildImagesResponse[] = images.map((img) => ({
    id: img.image_id,
    imageUrl: generateUrl(img.object_key, 300, 300),
    originalImageUrl: generateOriginalUrl(img.object_key),
    createdAt: img.created_at,
  }))

  res.json(response)
})

export default getChildImage
