import { useQuery } from "react-query"
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
    profilePictureUrl?: string
  }>
}
const useGetPlan = (id: string) => {
  const getPlan = getApi<GetPlanResponseBody>(`/plans/${id}`)

  return useQuery(["plan", id], getPlan)
}

export default useGetPlan
