import Icon from "$components/Icon/Icon"
import ImageListHeader from "$components/ImageListHeader"
import usePostImage from "$hooks/api/usePostImage"
import { useQueryString } from "$hooks/useQueryString"
import MediaLayout from "$layouts/MediaLayout"
import { withAuthorization } from "$lib/auth"
import { monthNames } from "$lib/dayjs"
import { findImagesByStudentId, findStudentByStudentId } from "$lib/db"
import { getStudentId, SSR } from "$lib/next"
import clsx from "clsx"
import Image from "next/future/image"
import Link from "next/link"
import { ChangeEventHandler, FC } from "react"
import { v4 as uuidv4 } from "uuid"
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
      <div className="relative z-10 -mt-6 mb-4 flex lg:-mt-8">
        <UploadImageButton
          onChange={handleImageUpload}
          isLoading={postImage.isLoading}
        />
      </div>

      {Object.keys(imagesByMonth).map((month) => (
        <section key={month} className="mb-16">
          <ImageListHeader>{month}</ImageListHeader>

          <ul className="mt-2 grid grid-cols-2 gap-4 px-4 md:grid-cols-3 lg:gap-8">
            {imagesByMonth[month].map(({ id, src }) => (
              <li key={id}>
                <Link href={`/${studentId}/media/images/${id}`}>
                  <a className="aspect-w-4 aspect-h-3 flex rounded-xl shadow">
                    <Image
                      src={src}
                      width={400}
                      height={300}
                      className="rounded-xl bg-gray-100 object-cover "
                      alt=""
                      sizes={"33vw"}
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
      "group mr-9 ml-auto flex cursor-pointer items-center rounded-full bg-primary-300 !p-4 text-base font-semibold text-primary-900 shadow ring ring-white transition hover:bg-primary-300 hover:text-black hover:shadow-lg focus:bg-primary-200 focus:ring-primary-500 lg:mr-12 lg:!px-6",
      isLoading && "!bg-primary-500"
    )}
  >
    {isLoading ? (
      <Icon
        src="/icons/spinner.svg"
        color="bg-primary-900 group-hover:bg-black"
        className="!h-6 !w-6 animate-spin"
      />
    ) : (
      <Icon
        src="/icons/image-add.svg"
        color="bg-primary-900 group-hover:bg-black"
      />
    )}

    <span className="ml-2 hidden lg:block">
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
