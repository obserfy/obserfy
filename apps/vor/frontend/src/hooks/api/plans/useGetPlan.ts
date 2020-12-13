import { queryCache, useQuery } from "react-query"
import { getApi } from "../fetchApi"

export interface GetPlanResponseBody {
  id: string
  title: string
  description: string
  classId: string
  date: string
  areaId?: string
  links: Array<{
    id: string
    url: string
    title?: string
    description?: string
    image?: string
  }>
  relatedStudents: Array<{
    id: string
    name: string
    profileImageUrl?: string
  }>
}
const useGetPlan = (id: string) => {
  const getPlan = getApi<GetPlanResponseBody>(`/plans/${id}`)

  return useQuery(["plan", id], getPlan)
}

export const getPlanCache = (id: string) => {
  return queryCache.getQueryData<GetPlanResponseBody>(["plan", id])
}

export const setPlanCache = (id: string, plan: GetPlanResponseBody) => {
  return queryCache.setQueryData<GetPlanResponseBody>(["plan", id], plan)
}

export default useGetPlan
