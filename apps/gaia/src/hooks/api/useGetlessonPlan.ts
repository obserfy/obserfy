import { useQuery } from "react-query"
import { getApi } from "./apiHelpers"

const useGetLessonPlan = (id: string) => {
  const getLessonPlan = getApi(`/plans/${id}`)
  return useQuery(["lesson-plan", id], getLessonPlan)
}

export default useGetLessonPlan
