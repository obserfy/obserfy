import { images as Images } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { withAuthorization } from "$lib/auth"
import { monthNames } from "$lib/dayjs"
import { findImagesByStudentId } from "$lib/db"
import { getStudentId } from "$lib/next"
import Icon from "$components/Icon/Icon"
import ImageListHeader from "$components/ImageListHeader"
import { useQueryString } from "$hooks/useQueryString"
import MediaLayout from "$layouts/MediaLayout"
import { generateOriginalUrl } from "../../../utils/imgproxy"

const VideosPage = ({ imagesByMonth }) => {
  const studentId = useQueryString("studentId")

  return (
    <MediaLayout title="MediaPage" currentPage="Videos">
      {Object.keys(imagesByMonth).map((month) => (
        <section className="mb-16">
          <ImageListHeader>{month}</ImageListHeader>

          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-4 lg:gap-y-8 px-4 mt-2">
            {imagesByMonth[month].map(({ id, src }) => (
              <li key={id}>
                <Link href={`/${studentId}/media/images/${id}`}>
                  <a className="flex rounded-xl shadow">
                    <Image
                      src={src}
                      width={400}
                      height={300}
                      objectFit="cover"
                      className="rounded-xl"
                    />
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </MediaLayout>
  )
}

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const images = await findImagesByStudentId(studentId)

  const imagesByMonth: { [key: string]: Array<Images & { src: string }> } = {}
  images.forEach((image) => {
    const month = image.created_at
      ? monthNames[image.created_at.getMonth()]
      : "-"
    const year = image.created_at?.getFullYear() ?? 0

    const key = `${month} ${year}`
    imagesByMonth[key] ??= []
    imagesByMonth[key].push({
      ...image,
      src: image.object_key ? generateOriginalUrl(image.object_key) : "",
    })
  })

  return { props: { imagesByMonth } }
})

export default VideosPage
