import { useQuery } from "react-query"
import { Dayjs } from "../../utils/dayjs"
import { getApi } from "./apiHelpers"
import { GetChildPlansResponse } from "../../pages/api/children/[childId]/plans"

const useGetChildPlans = (childId: string, date: Dayjs) => {
  const formattedDate = date.startOf("day").toISOString()
  const getChildPlans = getApi<GetChildPlansResponse[]>(
    `/children/${childId}/plans?date=${formattedDate}`
  )

  return useQuery(["childPlans", childId, formattedDate], getChildPlans, {
    enabled: childId,
  })
}

export default useGetChildPlans
