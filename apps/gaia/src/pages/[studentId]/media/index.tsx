import Image from "next/image"
import { images as Images } from "@prisma/client"
import Icon from "$components/Icon/Icon"
import MediaLayout from "$layouts/MediaLayout"
import { withAuthorization } from "$lib/auth"
import { findImagesByStudentId } from "$lib/db"
import { getStudentId, SSR } from "$lib/next"
import { generateOriginalUrl } from "../../../utils/imgproxy"

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const ImagesPage: SSR<typeof getServerSideProps> = ({ imagesByMonth }) => {
  return (
    <MediaLayout title="MediaPage" currentPage="Images">
      <div className="flex relative z-10 -mt-6 lg:-mt-8 mb-4">
        <button className="group flex items-center mr-8 lg:mr-12 ml-auto text-base text-white hover:text-black focus:text-white bg-black hover:bg-white focus:bg-gray-800 rounded-full ring ring-white focus:ring-primary-500 hover:shadow-lg transition lg:!px-6 !p-4">
          <Icon
            src="/icons/image-add.svg"
            color="bg-white group-hover:bg-black group-focus:bg-white "
          />
          <span className="hidden lg:block ml-2">Upload Image</span>
        </button>
      </div>

      {Object.keys(imagesByMonth).map((month) => (
        <section className="mb-16">
          <p className="flex sticky top-4 sm:top-20 z-10 flex-col items-center py-2 lg:py-3 px-4 mx-8 sm:mx-auto mb-2 sm:max-w-md font-semibold leading-none text-center text-gray-900 bg-white bg-opacity-90 rounded-full backdrop-filter backdrop-blur">
            {month}
            <div className="mt-1 w-6 h-1 bg-primary-500 rounded-full" />
          </p>

          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-4 lg:gap-y-8 px-4 mt-2">
            {imagesByMonth[month].map(({ id, src }) => (
              <li className="flex rounded-xl shadow">
                <Image
                  key={id}
                  src={src}
                  width={400}
                  height={400}
                  objectFit="cover"
                  className="rounded-xl"
                />
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
