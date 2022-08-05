import { findStudentImagesGroupedByMonths } from "$lib/images"
import { getFirstQueryValue, protectedApiRoute } from "../../../../utils/rest"

export type GetChildImagesResponse = Awaited<
  ReturnType<typeof findStudentImagesGroupedByMonths>
>

const getChildImage = protectedApiRoute(async (req, res) => {
  const childId = getFirstQueryValue(req, "childId")
  const images = await findStudentImagesGroupedByMonths(childId)

  if (!images) {
    res.status(404).end("not found")
    return
  }

  res.json(images)
})

export default getChildImage
