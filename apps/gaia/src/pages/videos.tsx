import Image from "next/image"
import React, { FC, Suspense, useState } from "react"
import Button from "../components/Button/Button"
import Icon from "../components/Icon/Icon"
import { LazyVideoPlayer } from "../components/LazyVideoPlayer"
import LoadingPlaceholder from "../components/LoadingPlaceholder/LoadingPlaceholder"
import useGetChildVideos from "../hooks/api/useGetChildVideos"
import { useQueryString } from "../hooks/useQueryString"

const VideosPage = () => {
  const childId = useQueryString("childId")
  const videos = useGetChildVideos(childId)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center">
        {videos.data?.map((v) => (
          <Video
            key={`${v.id}1`}
            thumbnailSrc={v.thumbnailUrl}
            playbackUrl={v.playbackUrl}
          />
        ))}
      </div>
    </div>
  )
}

const Video: FC<{ thumbnailSrc: string; playbackUrl: string }> = ({
  thumbnailSrc,
  playbackUrl,
}) => {
  const [showPlayer, setShowPlayer] = useState(false)

  return (
    <>
      <div className="w-1/3 md:w-1/5 relative">
        <div className="w-full" style={{ paddingTop: "100%" }}>
          <Image
            src={thumbnailSrc}
            layout="fill"
            objectFit="cover"
            className="cursor-pointer p-1"
            onClick={() => setShowPlayer(true)}
          />
        </div>
      </div>
      {showPlayer && (
        <div className="bg-overlay fixed top-0 left-0 right-0 bottom-0 z-50 md:flex items-center">
          <div className="bg-white md:max-w-lg md:mx-auto flex flex-col md:flex-row-reverse md:items-start md:rounded-lg overflow-hidden">
            <div className="bg-white md:w-80 p-3 flex items-center items-start">
              <div className="mr-auto">Find</div>
              <Button
                className="px-2 bg-white"
                onClick={() => setShowPlayer(false)}
              >
                <Icon src="/icons/close.svg" size={20} />
              </Button>
            </div>

            <Suspense fallback={<LoadingPlaceholder className="h-40 w-80" />}>
              <LazyVideoPlayer src={playbackUrl} />
            </Suspense>
          </div>
        </div>
      )}
    </>
  )
}

export default VideosPage
