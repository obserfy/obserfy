import auth0 from "../../../../utils/auth0"
import { getFirstQueryValue } from "../../../../utils/rest"
import { getChildImages } from "../../../../db"
import { generateUrl } from "../../../../utils/imgproxy"

export default auth0.requireAuthentication(async (req, res) => {
  try {
    const childId = getFirstQueryValue(req, "childId")
    const images = await getChildImages(childId as string)
    if (!images) {
      res.status(404).end("not found")
      return
    }
    res.status(200).json(
      images.map((img) => ({
        ...img,
        imageUrl: generateUrl(img.object_key, 200, 200),
      }))
    )
  } catch (err) {
    console.error(err)
    res.status(err.status || 500).end(err.message)
  }
})
