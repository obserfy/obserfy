import { images as Images } from "@prisma/client"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { ChangeEventHandler, FC } from "react"
import { v4 as uuidv4 } from "uuid"
import Icon from "$components/Icon/Icon"
import ImageListHeader from "$components/ImageListHeader"
import usePostImage from "$hooks/api/usePostImage"
import { useQueryString } from "$hooks/useQueryString"
import MediaLayout from "$layouts/MediaLayout"
import { withAuthorization } from "$lib/auth"
import { monthNames } from "$lib/dayjs"
import { findImagesByStudentId, findStudentByStudentId } from "$lib/db"
import { getStudentId, SSR } from "$lib/next"
import { generateOriginalUrl } from "../../../utils/imgproxy"

const ImagesPage: SSR<typeof getServerSideProps> = ({
  imagesByMonth,
  student,
}) => {
  const studentId = useQueryString("studentId")
  const postImage = usePostImage(studentId, student?.school_id ?? "")

  const handleImageUpload: ChangeEventHandler<HTMLInputElement> = async ({
    target,
  }) => {
    if (!target.files?.length) return
    await postImage.mutate({
      id: uuidv4(),
      file: target.files[0],
    })
  }

  return (
    <MediaLayout title="MediaPage" currentPage="Images">
      <div className="flex relative z-10 -mt-6 lg:-mt-8 mb-4">
        <UploadImageButton
          onChange={handleImageUpload}
          isLoading={postImage.isLoading}
        />
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

const UploadImageButton: FC<{
  onChange: ChangeEventHandler<HTMLInputElement>
  isLoading: boolean
}> = ({ onChange, isLoading }) => (
  <label
    htmlFor="upload-image"
    className={clsx(
      "group flex items-center mr-9 lg:mr-12 ml-auto text-base font-semibold text-primary-900 hover:text-black bg-primary-300 hover:bg-primary-300 focus:bg-primary-200 rounded-full ring ring-white focus:ring-primary-500 shadow hover:shadow-lg transition cursor-pointer lg:!px-6 !p-4",
      isLoading && "!bg-primary-500"
    )}
  >
    {isLoading ? (
      <Icon
        src="/icons/spinner.svg"
        color="bg-primary-900 group-hover:bg-black"
        className="animate-spin !w-6 !h-6"
      />
    ) : (
      <Icon
        src="/icons/image-add.svg"
        color="bg-primary-900 group-hover:bg-black"
      />
    )}

    <span className="hidden lg:block ml-2">
      {isLoading ? "Uploading" : "Upload Image"}
    </span>
    <input
      id="upload-image"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={onChange}
      disabled={isLoading}
    />
  </label>
)

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)

  const images = await findImagesByStudentId(studentId)
  const student = await findStudentByStudentId(studentId)

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
    props: {
      student: {
        id: student?.id,
        school_id: student?.school_id,
      },
      imagesByMonth,
    },
  }
})

export default ImagesPage
