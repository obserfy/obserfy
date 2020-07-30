import { useQuery } from "react-query"
import { Dayjs } from "../../dayjs"
import { getApi } from "../fetchApi"

export interface Plans {
  id: string
  title: string
  area?: {
    id: string
    name: string
  }
  user?: {
    id: string
    name: string
  }
}
function useGetStudentPlans(studentId: string, date: Dayjs) {
  const getPlans = getApi<Plans[]>(
    `/students/${studentId}/plans?date=${date.startOf("day").toISOString()}`
  )

  return useQuery(
    ["plans", studentId, date.startOf("day").toISOString()],
    getPlans
  )
}

export default useGetStudentPlans
