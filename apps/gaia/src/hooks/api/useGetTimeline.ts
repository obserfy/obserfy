import { useQuery } from "react-query"
import { getApi } from "./apiHelpers"
import { GetChildTimelineResponse } from "../../pages/api/children/[childId]/timeline"

const useGetTimeline = (childId: string) => {
  const getTimeline = getApi<GetChildTimelineResponse>(
    `/children/${childId}/timeline`
  )
  return useQuery(["child", childId, "timeline"], getTimeline, {
    enabled: childId,
  })
}

export default useGetTimeline
