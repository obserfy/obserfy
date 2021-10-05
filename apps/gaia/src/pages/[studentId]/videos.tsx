import Button from "$components/Button/Button"
import Icon from "$components/Icon/Icon"
import { LazyVideoPlayer } from "$components/LazyVideoPlayer"
import LoadingPlaceholder from "$components/LoadingPlaceholder/LoadingPlaceholder"
import useGetStudent from "$hooks/api/useGetChild"
import useGetStudentVideos from "$hooks/api/useGetChildVideos"
import useBodyScrollLock from "$hooks/useBodyScrollLock"
import { useQueryString } from "$hooks/useQueryString"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Head from "next/head"
import Image from "next/image"
import { FC, Suspense, useState } from "react"
import dayjs from "../../utils/dayjs"

const VideosPage = () => {
  const studentId = useQueryString("studentId")
  const student = useGetStudent(studentId)
  const videos = useGetStudentVideos(studentId)

  if (videos.isLoading || (videos.isSuccess && videos.data.length === 0)) {
    return (
      <>
        <Head>
          <title>Videos | Obserfy for Parents</title>
        </Head>

        <EmptyState loading={videos.isLoading} />
      </>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Head>
        <title>Videos | Obserfy for Parents</title>
      </Head>

      <div className="flex flex-wrap pr-1">
        {videos.data?.map((v) => (
          <Video
            key={`${v.id}1`}
            thumbnailSrc={v.thumbnailUrl}
            playbackUrl={v.playbackUrl}
            childName={student.data?.name}
            createdAt={v.createdAt}
          />
        ))}
      </div>
    </div>
  )
}

const Video: FC<{
  thumbnailSrc: string
  playbackUrl: string
  createdAt: string
  childName?: string
}> = ({ thumbnailSrc, playbackUrl, childName, createdAt }) => {
  const [showPlayer, setShowPlayer] = useState(false)

  return (
    <>
      <div className="relative w-1/3 md:w-1/5 cursor-pointer">
        <div className="w-full" style={{ paddingTop: "100%" }}>
          <Image
            src={thumbnailSrc}
            layout="fill"
            objectFit="cover"
            className="m-1 md:m-2 cursor-pointer"
            onClick={() => setShowPlayer(true)}
          />
        </div>
      </div>

      {showPlayer && (
        <VideoPlayerDialog
          childName={childName}
          date={createdAt}
          onClick={() => setShowPlayer(false)}
          src={playbackUrl}
          poster={thumbnailSrc}
        />
      )}
    </>
  )
}

const VideoPlayerDialog: FC<{
  childName: string | undefined
  date: string
  onClick: () => void
  src: string
  poster: string
}> = ({ childName, date, onClick, src, poster }) => {
  const ref = useBodyScrollLock()

  return (
    <div className="flex fixed top-0 right-0 bottom-0 left-0 z-50 items-center bg-overlay">
      <div
        className="flex overflow-hidden fixed md:relative top-0 right-0 bottom-0 left-0 flex-col md:flex-row-reverse md:items-start md:mx-auto w-full md:max-w-2xl md:h-auto max-h-screen bg-white md:rounded-lg"
        ref={ref}
        style={{ minHeight: 200 }}
      >
        <div className="flex items-center p-3 md:w-1/2 bg-white">
          <div className="w-full">
            <div className="mr-auto font-bold">{childName}</div>
            <div className="mr-auto text-xs">
              {dayjs(date).format("dddd, DD MMM YYYY")}
            </div>
          </div>
          <Button className="px-2 bg-white" onClick={onClick}>
            <Icon src="/icons/close.svg" />
          </Button>
        </div>

        <Suspense fallback={<LoadingPlaceholder className="w-full h-96" />}>
          <LazyVideoPlayer src={src} poster={poster} />
        </Suspense>
      </div>
    </div>
  )
}

const EmptyState: FC<{ loading: boolean }> = ({ loading }) => (
  <div
    className={`flex flex-col items-center pt-16 pb-8 ${
      loading && "opacity-50"
    } transition-opacity duration-200 max-w-3xl mx-auto`}
  >
    <Image
      src="/images/no-videos-illustrations.svg"
      className="mb-3 w-64 md:w-1/2"
      height={250}
      width={200}
    />
    <h6
      className={`text-xl mx-4 text-center ${
        loading && "opacity-0"
      } transition-opacity duration-200 font-bold`}
    >
      No videos uploaded yet
    </h6>
  </div>
)

export default withPageAuthRequired(VideosPage)
