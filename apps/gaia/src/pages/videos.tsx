import React from "react"
import useGetChildVideos from "../hooks/api/useGetChildVideos"
import { useQueryString } from "../hooks/useQueryString"

const VideosPage = () => {
  const childId = useQueryString("childId")
  const videos = useGetChildVideos(childId)

  return <div>Videos</div>
}

export default VideosPage
