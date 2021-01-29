import { useQuery } from "react-query"
import { GetChildPlansResponse } from "../../pages/api/children/[childId]/plans/all"
import { getApi } from "./apiHelpers"

const useGetAllLessonPlans = (childId: string) => {
  const getChildPlans = getApi<GetChildPlansResponse[]>(
    `/children/${childId}/plans/all`
  )

  return useQuery(["child", childId, "plans"], getChildPlans, {
    enabled: childId !== "",
  })
}

export default useGetAllLessonPlans
