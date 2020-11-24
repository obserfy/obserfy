import { useQuery } from "react-query"
import { GetChildResponse } from "../../pages/api/children/[childId]"
import { getApi } from "./apiHelpers"

const useGetChild = (childId: string) => {
  const getChild = getApi<GetChildResponse>(`/children/${childId}`)
  return useQuery(["child", childId], getChild, {
    enabled: childId,
  })
}

export default useGetChild
