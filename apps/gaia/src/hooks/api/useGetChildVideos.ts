import { useQuery } from "react-query"
import { GetChildVideosResponse } from "../../pages/api/children/[childId]/videos"
import { getApi } from "./apiHelpers"

const useGetChildVideos = (childId: string) => {
  const getChildVideos = getApi<GetChildVideosResponse>(
    `/children/${childId}/videos`
  )

  return useQuery(["child", childId, "videos"], getChildVideos)
}

export default useGetChildVideos
