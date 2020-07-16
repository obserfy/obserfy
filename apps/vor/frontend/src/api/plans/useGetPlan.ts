import { useQuery } from "react-query"
import { getApi } from "../fetchApi"

export interface PlanDetails {
  id: string
  title: string
  description: string
  classId: string
  date: string
  areaId?: string
}
const useGetPlan = (id: string) => {
  const getPlan = getApi<PlanDetails>(`/plans/${id}`)

  return useQuery(["plan", id], getPlan)
}

export default useGetPlan
