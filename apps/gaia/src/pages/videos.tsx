import React from "react"
import Image from "next/image"
import useGetChildVideos from "../hooks/api/useGetChildVideos"
import { useQueryString } from "../hooks/useQueryString"

const VideosPage = () => {
  const childId = useQueryString("childId")
  const videos = useGetChildVideos(childId)

  return (
    <div className="max-w-3xl mx-auto">
      {videos.data?.map((v) => {
        return (
          <Image
            key={v.id}
            src={v.thumbnailUrl}
            width={200}
            height={200}
            objectFit="cover"
          />
        )
      })}
    </div>
  )
}

export default VideosPage
