import { useQuery } from "react-query"
import { fetchApi } from "./fetchApi"
import { getSchoolId } from "../hooks/schoolIdState"

interface Plans {
  title: string
}
function useGetPlans(date: string) {
  const schoolId = getSchoolId()
  const getPlans = fetchApi<Plans[]>(`/schools/${schoolId}/plans?date=${date}`)

  return useQuery(["plans", schoolId, date], getPlans)
}

export default useGetPlans
