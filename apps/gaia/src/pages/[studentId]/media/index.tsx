import Image from "next/image"
import Icon from "$components/Icon/Icon"
import MediaLayout from "$layouts/MediaLayout"
import { withAuthorization } from "$lib/auth"
import { findImagesByStudentId } from "$lib/db"
import { getStudentId, SSR } from "$lib/next"
import { generateOriginalUrl } from "../../../utils/imgproxy"

const ImagesPage: SSR<typeof getServerSideProps> = ({ images }) => {
  return (
    <MediaLayout title="MediaPage" currentPage="Images">
      <div className="flex relative z-10 -mt-6 lg:-mt-8">
        <button className="group flex items-center mr-8 lg:mr-12 ml-auto text-base text-white hover:text-black focus:text-white bg-black hover:bg-white focus:bg-gray-800 rounded-full ring ring-white focus:ring-primary-500 hover:shadow-lg transition lg:!px-6 !p-4">
          <Icon
            src="/icons/image-add.svg"
            color="bg-white group-hover:bg-black group-focus:bg-white"
          />
          <span className="hidden lg:block ml-2">Upload Image</span>
        </button>
      </div>

      <p className="py-2 lg:py-4 px-4 my-4 mx-4 text-lg lg:text-xl font-bold text-center text-gray-600 bg-gray-200 rounded-xl">
        March 2021
      </p>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-x-4 lg:gap-x-8 gap-y-4 lg:gap-y-8 px-4 mt-2">
        {images.map(({ id, src }) => (
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
    </MediaLayout>
  )
}

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const images = await findImagesByStudentId(studentId)

  return {
    props: {
      images:
        images?.map((i) => ({
          id: i.id,
          src: i.object_key ? generateOriginalUrl(i.object_key) : "",
        })) ?? [],
    },
  }
})

export default ImagesPage
