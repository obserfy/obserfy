import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import Image from "next/image"
import { FC, Suspense, useState } from "react"
import Head from "next/head"
import dayjs from "../utils/dayjs"
import Button from "../components/Button/Button"
import Icon from "../components/Icon/Icon"
import { LazyVideoPlayer } from "../components/LazyVideoPlayer"
import LoadingPlaceholder from "../components/LoadingPlaceholder/LoadingPlaceholder"
import useGetChild from "../hooks/api/useGetChild"
import useGetChildVideos from "../hooks/api/useGetChildVideos"
import useBodyScrollLock from "../hooks/useBodyScrollLock"
import { useQueryString } from "../hooks/useQueryString"

const VideosPage = () => {
  const childId = useQueryString("childId")
  const child = useGetChild(childId)
  const videos = useGetChildVideos(childId)

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
    <div className="max-w-3xl mx-auto">
      <Head>
        <title>Videos | Obserfy for Parents</title>
      </Head>

      <div className="flex flex-wrap pr-1">
        {videos.data?.map((v) => (
          <Video
            key={`${v.id}1`}
            thumbnailSrc={v.thumbnailUrl}
            playbackUrl={v.playbackUrl}
            childName={child.data?.name}
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
      <div className="w-1/3 md:w-1/5 relative cursor-pointer">
        <div className="w-full" style={{ paddingTop: "100%" }}>
          <Image
            src={thumbnailSrc}
            layout="fill"
            objectFit="cover"
            className="cursor-pointer m-1 md:m-2"
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
    <div className="bg-overlay fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center ">
      <div
        className="bg-white md:max-w-2xl w-full md:mx-auto flex flex-col md:flex-row-reverse md:items-start md:rounded-lg overflow-hidden md:h-auto top-0 fixed bottom-0 left-0 right-0 md:relative max-h-screen"
        ref={ref}
        style={{ minHeight: 200 }}
      >
        <div className="bg-white md:w-1/2 p-3 flex items-center items-start">
          <div className="w-full">
            <div className="mr-auto font-bold">{childName}</div>
            <div className="mr-auto text-xs">
              {dayjs(date).format("dddd, DD MMM YYYY")}
            </div>
          </div>
          <Button className="px-2 bg-white" onClick={onClick}>
            <Icon src="/icons/close.svg" size={20} />
          </Button>
        </div>

        <Suspense fallback={<LoadingPlaceholder className="h-96 w-full" />}>
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
      className="w-64 md:w-1/2 mb-3"
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
