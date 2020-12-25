import { useQuery } from "react-query"
import { useQueryCache } from "../../useQueryCache"
import { getApi } from "../fetchApi"

const KEY = (planId: string) => ["plan", planId]

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

  return useQuery(KEY(id), getPlan)
}

export const useGetPlanCache = (planId: string) => {
  return useQueryCache<GetPlanResponseBody>(KEY(planId))
}

export default useGetPlan
