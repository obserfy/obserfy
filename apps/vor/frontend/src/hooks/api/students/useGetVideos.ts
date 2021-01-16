import { useQuery } from "react-query"
import { getApi } from "../fetchApi"

interface GetStudentVideosResponse {
  id: string
  playbackUrl: string
  thumbnailUrl: string
  status: string
}
const useGetVideos = (studentId: string) => {
  const getVideos = getApi<GetStudentVideosResponse[]>(
    `/students/${studentId}/videos`
  )
  return useQuery(["students", studentId, "videos"], getVideos)
}

export default useGetVideos
