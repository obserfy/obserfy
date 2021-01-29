import { useQuery, useQueryClient } from "react-query"
import { Dayjs } from "../../utils/dayjs"
import { getApi } from "./apiHelpers"
import { GetChildPlansResponse } from "../../pages/api/children/[childId]/plans/daily"

const useGetDailyLessonPlans = (childId: string, date: Dayjs) => {
  const formattedDate = date.startOf("day").toISOString()
  const getChildPlans = getApi<GetChildPlansResponse[]>(
    `/children/${childId}/plans/daily?date=${formattedDate}`
  )

  return useQuery(["childPlans", childId, formattedDate], getChildPlans, {
    enabled: childId !== "",
  })
}

export const useGetChildPlansCache = () => {
  const client = useQueryClient()
  const key = ["childPlans"]

  return {
    invalidateAll: () => client.invalidateQueries(key),
  }
}

export default useGetDailyLessonPlans
