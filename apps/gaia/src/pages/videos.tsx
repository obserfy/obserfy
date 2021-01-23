import Image from "next/image"
import React, { FC, Suspense, useState } from "react"
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

  return (
    <div className="max-w-3xl mx-auto">
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
}> = ({ childName, date, onClick, src }) => {
  const ref = useBodyScrollLock()

  return (
    <div className="bg-overlay fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center ">
      <div
        className="bg-white md:max-w-2xl w-full md:mx-auto flex flex-col md:flex-row-reverse md:items-start md:rounded-lg overflow-hidden h-screen md:h-auto"
        ref={ref}
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

        <Suspense fallback={<LoadingPlaceholder className="h-96 w-80" />}>
          <LazyVideoPlayer src={src} />
        </Suspense>
      </div>
    </div>
  )
}

export default VideosPage
