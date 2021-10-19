import Image from "next/image"
import { images as Images } from "@prisma/client"
import Link from "next/link"
import ImageListHeader from "$components/ImageListHeader"
import { useQueryString } from "$hooks/useQueryString"
import { monthNames } from "$lib/dayjs"
import Icon from "$components/Icon/Icon"
import MediaLayout from "$layouts/MediaLayout"
import { withAuthorization } from "$lib/auth"
import { findImagesByStudentId } from "$lib/db"
import { getStudentId, SSR } from "$lib/next"
import { generateOriginalUrl } from "../../../utils/imgproxy"

const ImagesPage: SSR<typeof getServerSideProps> = ({ imagesByMonth }) => {
  const studentId = useQueryString("studentId")

  return (
    <MediaLayout title="MediaPage" currentPage="Images">
      <div className="flex relative z-10 -mt-6 lg:-mt-8 mb-4">
        <button className="group flex items-center mr-9 lg:mr-12 ml-auto text-base font-semibold text-primary-900 hover:text-black bg-primary-300 hover:bg-primary-300 focus:bg-primary-200 rounded-full ring ring-white focus:ring-primary-500 shadow hover:shadow-lg transition lg:!px-6 !p-4">
          <Icon
            src="/icons/image-add.svg"
            color="bg-primary-900 group-hover:bg-black"
          />
          <span className="hidden lg:block ml-2">Upload Image</span>
        </button>
      </div>

      {Object.keys(imagesByMonth).map((month) => (
        <section className="mb-16">
          <ImageListHeader>{month}</ImageListHeader>

          <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-4 lg:gap-y-8 px-4 mt-2">
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

export default ImagesPage
