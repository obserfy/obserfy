import { getSession } from "@auth0/nextjs-auth0"
import { findChildVideos } from "../../../../db/queries"
import { getFirstQueryValue, protectedApiRoute } from "../../../../utils/rest"

interface Video {
  createdAt: string
  id: string
  thumbnailUrl: string
  playbackUrl: string
}

export type GetChildVideosResponse = Video[]

const getChildVideos = protectedApiRoute(async (req, res) => {
  const session = await getSession(req, res)
  if (!session) {
    res.status(401).end("unauthorized")
    return
  }

  const childId = getFirstQueryValue(req, "childId")
  const videos = await findChildVideos(childId as string)

  if (!videos) {
    res.status(404).end("not found")
    return
  }

  const response: GetChildVideosResponse = videos.map((video) => ({
    id: video.id,
    playbackUrl: video.playback_url,
    thumbnailUrl: video.thumbnail_url,
    createdAt: video.created_at.toISOString(),
  }))

  res.json(response)
})

export default getChildVideos
