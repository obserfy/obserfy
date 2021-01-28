import { useQuery } from "react-query"
import { GetChildPlansResponse } from "../../pages/api/children/[childId]/plans"
import { getApi } from "./apiHelpers"

const useGetChildPlans = (childId: string) => {
  const getChildPlans = getApi<GetChildPlansResponse[]>(
    `/children/${childId}/plans`
  )

  return useQuery(["child", childId, "plans"], getChildPlans, {
    enabled: childId !== "",
  })
}

export default useGetChildPlans
