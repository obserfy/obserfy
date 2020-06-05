import { useQuery } from "react-query"
import { fetchApi } from "./fetchApi"

export interface PlanDetails {
  id: string
  title: string
  description: string
  classId: string
  date: string
}
const useGetPlan = (id: string) => {
  const getPlan = fetchApi<PlanDetails>(`/plans/${id}`)

  return useQuery(["plan", id], getPlan)
}

export default useGetPlan
