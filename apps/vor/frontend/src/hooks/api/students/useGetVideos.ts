import { useQuery } from "react-query"
import { VideoStatus } from "../../../domain/video"
import { useQueryCache } from "../../useQueryCache"
import { getApi } from "../fetchApi"

interface GetStudentVideosResponse {
  createdAt: string
  originalThumbnailUrl: string
  id: string
  playbackUrl: string
  thumbnailUrl: string
  status: VideoStatus
}
const useGetVideos = (studentId: string, shouldPoll?: boolean) => {
  const getVideos = getApi<GetStudentVideosResponse[]>(
    `/students/${studentId}/videos`
  )
  return useQuery(["students", studentId, "videos"], getVideos, {
    refetchInterval: shouldPoll ? 2000 : false,
  })
}

export const useGetStudentVideosCache = (studentId: string) => {
  return useQueryCache<GetStudentVideosResponse[]>([
    "students",
    studentId,
    "videos",
  ])
}

export default useGetVideos
