import { useQuery } from "react-query"
import { GetLessonPlanResponse } from "../../pages/api/plans/[planId]"
import { getApi } from "./apiHelpers"

const useGetLessonPlan = (id: string) => {
  const getLessonPlan = getApi<GetLessonPlanResponse>(`/plans/${id}`)
  return useQuery(["lesson-plan", id], getLessonPlan)
}

export default useGetLessonPlan
