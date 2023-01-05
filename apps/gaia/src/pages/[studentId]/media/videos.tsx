import ImageListHeader from "$components/ImageListHeader"
import { useQueryString } from "$hooks/useQueryString"
import MediaLayout from "$layouts/MediaLayout"
import { withAuthorization } from "$lib/auth"
import { monthNames } from "$lib/dayjs"
import { findVideosByStudentId } from "$lib/db"
import { getStudentId, SSR } from "$lib/next"
import Image from "next/image"
import Link from "next/link"

const VideosPage: SSR<typeof getServerSideProps> = ({ videosByMonth }) => {
  const studentId = useQueryString("studentId")

  return (
    <MediaLayout title="MediaPage" currentPage="Videos">
      {Object.keys(videosByMonth).map((month) => (
        <section key={month} className="mt-8">
          <ImageListHeader>{month}</ImageListHeader>

          <ul className="mt-2 grid grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:gap-8">
            {videosByMonth[month].map(({ id, src }) => (
              <li key={id}>
                <Link
                  href={`/${studentId}/media/videos/${id}`}
                  className="flex rounded-xl shadow"
                >
                  <Image
                    src={src}
                    width={400}
                    height={300}
                    objectFit="cover"
                    className="rounded-xl"
                    alt=""
                  />
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
  const videos = await findVideosByStudentId(studentId)

  const videosByMonth: {
    [key: string]: Array<{ id: string; src: string }>
  } = {}
  videos.forEach((v) => {
    const month = v.created_at ? monthNames[v.created_at.getMonth()] : "-"
    const year = v.created_at?.getFullYear() ?? 0

    const key = `${month} ${year}`
    videosByMonth[key] ??= []
    videosByMonth[key].push({
      id: v.id,
      src: v.thumbnail_url || "",
    })
  })

  return { props: { videosByMonth } }
})

export default VideosPage
