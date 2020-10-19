import auth0 from "../../../../utils/auth0"
import { getFirstQueryValue } from "../../../../utils/rest"
import { getChildImages } from "../../../../db"
import { generateOriginalUrll, generateUrl } from "../../../../utils/imgproxy"

export interface GetChildImagesResponse {
  id: string
  imageUrl: string
  originalImageUrl: string
}
export default auth0.requireAuthentication(async (req, res) => {
  try {
    const childId = getFirstQueryValue(req, "childId")
    const images = await getChildImages(childId as string)

    if (!images) {
      res.status(404).end("not found")
      return
    }

    const response: GetChildImagesResponse[] = images.map((img) => ({
      id: img.image_id,
      imageUrl: generateUrl(img.object_key, 300, 300),
      originalImageUrl: generateOriginalUrll(img.object_key),
    }))

    res.json(response)
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).end(err.message)
  }
})
