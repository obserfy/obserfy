import { useQuery } from "react-query"
import { fetchApi } from "./fetchApi"
import { getSchoolId } from "../hooks/schoolIdState"
import { Dayjs } from "../dayjs"

export interface Plans {
  id: string
  title: string
}
function useGetPlans(date: Dayjs) {
  const schoolId = getSchoolId()
  const getPlans = fetchApi<Plans[]>(
    `/schools/${schoolId}/plans?date=${date.startOf("day").toISOString()}`
  )

  return useQuery(
    ["plans", schoolId, date.startOf("day").toISOString()],
    getPlans
  )
}

export default useGetPlans
