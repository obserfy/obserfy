import { useQuery } from "react-query"
import { getApi } from "./apiHelpers"

const useGetChildVideos = (childId: string) => {
  const getChildVideos = getApi(`/children/${childId}/videos`)

  return useQuery(["childImages", childId], getChildVideos)
}

export default useGetChildVideos
