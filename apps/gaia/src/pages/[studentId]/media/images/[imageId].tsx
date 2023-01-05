import Image from "next/image"
import Link from "next/link"
import { FC } from "react"
import ImageListHeader from "$components/ImageListHeader"
import dayjs from "$lib/dayjs"
import Icon from "$components/Icon/Icon"
import StudentProfile from "$components/StudentProfile"
import { useQueryString } from "$hooks/useQueryString"
import BaseLayout from "$layouts/BaseLayout"
import { withAuthorization } from "$lib/auth"
import {
  findImageByStudentIdAndImageId,
  findRelatedImageByImageId,
} from "$lib/db"
import { getQueryString, getStudentId, SSR } from "$lib/next"
import { generateOriginalUrl } from "../../../../utils/imgproxy"

const ImageDetails: SSR<typeof getServerSideProps> = ({
  relatedImage,
  image,
}) => {
  const studentId = useQueryString("studentId")

  return (
    <BaseLayout title="Image Details">
      <div className="mx-auto w-full">
        <div className="relative h-[70vh] w-full bg-black">
          <Image
            key={image.id}
            src={image.src}
            layout="fill"
            objectFit="scale-down"
            alt=""
          />
        </div>
      </div>

      <div className="mx-auto max-w-7xl flex-row-reverse lg:flex">
        <div className="w-full lg:max-w-sm">
          <div className="w-full p-4">
            <Breadcrumb />
          </div>

          <div className="mx-4 rounded-xl border shadow-sm">
            <h3 className="p-4 font-semibold text-gray-900">Information</h3>

            <dl className="divide-y divide-gray-200 border-t border-gray-200 px-4">
              <div className="flex justify-between py-3 font-medium">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-900">
                  {dayjs(image.created_at).format("dddd, DD MMM YYYY")}
                </dd>
              </div>

              <div className="flex justify-between py-3 font-medium">
                <dt className="text-gray-500">School</dt>
                <dd className="text-gray-900">{image.school.name}</dd>
              </div>
            </dl>

            <h3 className="p-4 font-semibold text-gray-900">Students</h3>
            <ul className="divide-y divide-gray-200 border-t border-gray-200 px-4">
              {image.students?.map(({ id, profile_pic, name }) => (
                <li className="flex items-center py-3 font-medium" key={id}>
                  <StudentProfile
                    src={profile_pic}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <p className="ml-3 text-gray-900">{name}</p>
                </li>
              ))}
            </ul>
          </div>
          {(image.observations?.length ?? 0) > 0 && (
            <div className="mx-4 mt-4 overflow-hidden rounded-xl border shadow-sm">
              <h3 className="p-4 font-semibold text-gray-900">Observations</h3>
              <ul className="divide-y divide-gray-200 border-t border-gray-200">
                {image.observations?.map((o) => (
                  <Observation key={o.id} {...o} />
                ))}
              </ul>
            </div>
          )}
        </div>

        {relatedImage.length > 0 && (
          <div className="mt-8 sm:mt-0">
            <ImageListHeader className="!my-4 md:text-lg lg:!my-3">
              Related Photos
            </ImageListHeader>
            <ul className="mt-4 grid grid-cols-2 gap-4 px-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8 xl:pr-4">
              {relatedImage.map(({ id, src }) => (
                <li key={id}>
                  <Link
                    href={`/${studentId}/media/images/${id}`}
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
          </div>
        )}
      </div>
    </BaseLayout>
  )
}

const Observation: FC<{
  event_time?: string
  short_desc: string | null
  long_desc: string | null
  areas: { name: string | null } | null
}> = ({ short_desc, areas, event_time, long_desc }) => (
  <li className="relative bg-white p-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-600">
    <div className="flex justify-between space-x-3">
      <div className="block truncate text-left focus:outline-none">
        <span className="absolute inset-0" aria-hidden="true" />
        <p className="truncate font-semibold text-gray-900">{short_desc}</p>
        <p className="truncate font-semibold text-primary-600">
          {areas?.name ?? "Others"}
        </p>
      </div>

      <time
        dateTime={event_time}
        className="flex shrink-0 whitespace-nowrap text-gray-500"
      >
        {dayjs(event_time).format("DD MMM YYYY")}
      </time>
    </div>
    <div className="mt-1">
      {long_desc && (
        <div
          className="prose max-w-none text-gray-700"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: long_desc }}
        />
      )}
    </div>
  </li>
)

const Breadcrumb = () => {
  const studentId = useQueryString("studentId")
  const pages = [
    { name: "Photos", href: `/${studentId}/media`, current: false },
    { name: "Details", href: `#`, current: true },
  ]

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex w-full items-center justify-center space-x-4 rounded-xl border bg-gray-100 p-3">
        <li>
          <div>
            <Link
              href={`/${studentId}/media`}
              className="text-gray-400 hover:text-gray-500"
            >
              <Icon
                src="/icons/camera.svg"
                className="!h-6 !w-6 shrink-0"
                color="bg-gray-500"
                aria-hidden="true"
              />
              <span className="sr-only">Medias</span>
            </Link>
          </div>
        </li>

        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <svg
                className="h-5 w-5 shrink-0 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>

              <Link
                href={page.href}
                className="ml-4 font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const imageId = getQueryString(ctx, "imageId")
  if (!imageId) return { notFound: true }

  const image = await findImageByStudentIdAndImageId(studentId, imageId)
  const relatedImages = await findRelatedImageByImageId(imageId)

  if (!image) {
    return { notFound: true }
  }

  return {
    props: {
      relatedImage: relatedImages.map((img) => ({
        id: img.id,
        src: img?.object_key ? generateOriginalUrl(img.object_key) : "",
      })),
      image: {
        id: image?.id,
        created_at: image?.created_at?.toISOString(),
        school: {
          name: image?.schools?.name,
        },
        observations: image?.observation_to_images.map(({ observations }) => ({
          id: observations.id,
          event_time: observations?.event_time?.toISOString(),
          short_desc: observations?.short_desc,
          long_desc: observations?.long_desc,
          areas: observations?.areas,
        })),
        src: image?.object_key ? generateOriginalUrl(image.object_key) : "",
        students: image?.image_to_students.map(({ students }) => {
          const profilePic = students.images?.object_key
            ? generateOriginalUrl(students.images?.object_key)
            : ""

          return {
            id: students.id,
            name: students.name,
            profile_pic: profilePic,
          }
        }),
      },
    },
  }
})

export default ImageDetails
