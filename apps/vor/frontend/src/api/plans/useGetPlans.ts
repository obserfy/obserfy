import { useQuery } from "react-query"
import { getApi } from "../fetchApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { Dayjs } from "../../dayjs"

export interface Plans {
  id: string
  title: string
  area?: {
    id: string
    name: string
  }
}
function useGetPlans(date: Dayjs) {
  const schoolId = getSchoolId()
  const getPlans = getApi<Plans[]>(
    `/schools/${schoolId}/plans?date=${date.startOf("day").toISOString()}`
  )

  return useQuery(
    ["plans", schoolId, date.startOf("day").toISOString()],
    getPlans
  )
}

export default useGetPlans
