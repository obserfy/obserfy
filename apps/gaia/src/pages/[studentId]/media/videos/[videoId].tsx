import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"
import useToggle from "$hooks/useToggle"
import { LazyVideoPlayer } from "$components/LazyVideoPlayer"
import Icon from "$components/Icon/Icon"
import ImageListHeader from "$components/ImageListHeader"
import StudentProfile from "$components/StudentProfile"
import { useQueryString } from "$hooks/useQueryString"
import BaseLayout from "$layouts/BaseLayout"
import { withAuthorization } from "$lib/auth"
import dayjs from "$lib/dayjs"
import {
  findOtherVideosByStudentId,
  findVideoByStudentIdAndImageId,
} from "$lib/db"
import { getQueryString, getStudentId, SSR } from "$lib/next"
import { generateOriginalUrl } from "../../../../utils/imgproxy"

const ImageDetails: SSR<typeof getServerSideProps> = ({
  relatedVideos,
  video,
  students,
}) => {
  const player = useToggle()
  const studentId = useQueryString("studentId")

  return (
    <BaseLayout title="Image Details">
      <div className="mx-auto w-full">
        <div className="aspect-w-10 aspect-h-9 relative w-full bg-black md:aspect-w-16 md:aspect-h-8">
          {!player.isOn && video.thumbnail_url && (
            <>
              <Image
                src={video.thumbnail_url}
                layout="fill"
                objectFit="contain"
              />
              <button onClick={player.toggle}>
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-30">
                  <Icon
                    src="/icons/play.svg"
                    className="!h-16 !w-16"
                    color="bg-white"
                  />
                </div>
              </button>
            </>
          )}
          {player.isOn && video.thumbnail_url && (
            <Suspense fallback={<p>loading</p>}>
              <LazyVideoPlayer
                src={video.playback_url as string}
                poster={video.thumbnail_url}
                autoplay
                // layout="fill"
                // objectFit="scale-down"
              />
            </Suspense>
          )}
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
                  {dayjs(video.created_at).format("dddd, DD MMM YYYY")}
                </dd>
              </div>

              <div className="flex justify-between py-3 font-medium">
                <dt className="text-gray-500">School</dt>
                <dd className="text-gray-900">{video.schools?.name}</dd>
              </div>
            </dl>

            <h3 className="p-4 font-semibold text-gray-900">Students</h3>
            <ul className="divide-y divide-gray-200 border-t border-gray-200 px-4">
              {students?.map(({ id, name, profile_pic }) => (
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
        </div>

        {relatedVideos.length > 0 && (
          <div className="mt-8 sm:mt-0">
            <ImageListHeader className="!my-4 md:text-lg lg:!my-3">
              Related Videos
            </ImageListHeader>
            <ul className="mt-4 grid grid-cols-2 gap-4 px-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8 xl:pr-4">
              {relatedVideos.map(({ id, thumbnail_url }) => (
                <li key={id}>
                  <Link href={`/${studentId}/media/videos/${id}`}>
                    <a className="flex rounded-xl shadow">
                      {thumbnail_url && (
                        <Image
                          src={thumbnail_url}
                          width={400}
                          height={300}
                          objectFit="cover"
                          className="rounded-xl"
                        />
                      )}
                    </a>
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

const Breadcrumb = () => {
  const studentId = useQueryString("studentId")
  const pages = [
    { name: "Videos", href: `/${studentId}/media/videos`, current: false },
    { name: "Details", href: `#`, current: true },
  ]

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex w-full items-center justify-center space-x-4 rounded-xl border bg-gray-100 p-3">
        <li>
          <div>
            <Link href={`/${studentId}/media`}>
              <a className="text-gray-400 hover:text-gray-500">
                <Icon
                  src="/icons/video.svg"
                  className="!h-6 !w-6 shrink-0"
                  color="bg-gray-500"
                  aria-hidden="true"
                />
                <span className="sr-only">Medias</span>
              </a>
            </Link>
          </div>
        </li>

        {pages.map((page) => (
          <li key={page.name} className="flex items-center">
            <svg
              className="h-5 w-5 shrink-0 text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
            </svg>

            <Link href={page.href}>
              <a
                className="ml-4 font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </a>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export const getServerSideProps = withAuthorization(async (ctx) => {
  const studentId = getStudentId(ctx)
  const videoId = getQueryString(ctx, "videoId")
  if (!videoId) return { notFound: true }

  const video = await findVideoByStudentIdAndImageId(studentId, videoId)

  const relatedVideos = await findOtherVideosByStudentId(studentId, videoId)

  if (!video?.playback_url) return { notFound: true }

  return {
    props: {
      relatedVideos,
      video: {
        id: video.id,
        thumbnail_url: video.thumbnail_url,
        schools: {
          name: video.schools?.name,
        },
        created_at: video.created_at?.toISOString(),
        playback_url: video.playback_url,
      },
      students: video?.video_to_students.map(({ students }) => {
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
  }
})

export default ImageDetails
