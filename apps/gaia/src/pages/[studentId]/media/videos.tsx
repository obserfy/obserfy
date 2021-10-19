import { videos as Videos } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import ImageListHeader from "$components/ImageListHeader"
import { useQueryString } from "$hooks/useQueryString"
import MediaLayout from "$layouts/MediaLayout"
import { withAuthorization } from "$lib/auth"
import { monthNames } from "$lib/dayjs"
import { findVideosByStudentId } from "$lib/db"
import { getStudentId, SSR } from "$lib/next"

const VideosPage: SSR<typeof getServerSideProps> = ({ videosByMonth }) => {
  const studentId = useQueryString("studentId")

  return (
    <MediaLayout title="MediaPage" currentPage="Videos">
      {Object.keys(videosByMonth).map((month) => (
        <section className="mt-8">
          <ImageListHeader>{month}</ImageListHeader>

          <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-4 lg:gap-y-8 px-4 mt-2">
            {videosByMonth[month].map(({ id, src }) => (
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
  const videos = await findVideosByStudentId(studentId)

  const videosByMonth: { [key: string]: Array<Videos & { src: string }> } = {}
  videos.forEach((v) => {
    const month = v.created_at ? monthNames[v.created_at.getMonth()] : "-"
    const year = v.created_at?.getFullYear() ?? 0

    const key = `${month} ${year}`
    videosByMonth[key] ??= []
    videosByMonth[key].push({
      ...v,
      src: v.thumbnail_url || "",
    })
  })

  return { props: { videosByMonth } }
})

export default VideosPage
