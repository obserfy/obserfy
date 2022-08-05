import { monthNames } from "$lib/dayjs"
import { findImagesByStudentId } from "$lib/db"
import { generateOriginalUrl } from "../../utils/imgproxy"

export const findStudentImagesGroupedByMonths = async (studentId: string) => {
  const images = await findImagesByStudentId(studentId)

  const imagesByMonth: {
    [key: string]: Array<{ src: string; created_at?: string; id: string }>
  } = {}
  images.forEach((image) => {
    const month = image.created_at
      ? monthNames[image.created_at.getMonth()]
      : "-"
    const year = image.created_at?.getFullYear() ?? 0

    const key = `${month} ${year}`
    imagesByMonth[key] ??= []
    imagesByMonth[key].push({
      id: image.id,
      src: image.object_key ? generateOriginalUrl(image.object_key) : "",
      created_at: image.created_at?.toISOString(),
    })
  })

  return {
    months: Object.keys(imagesByMonth),
    imagesByMonth,
  }
}
