import { useQuery } from "react-query"
import { Dayjs } from "../utils/dayjs"

const useGetChildPlans = (childId: string, date: Dayjs) => {
  const formattedDate = date.startOf("day").toISOString()
  const getChildPlans = async () => {
    const result = await fetch(
      `/api/children/${childId}/plans?date=${formattedDate}`,
      { credentials: "same-origin" }
    )

    return result.json()
  }
  return useQuery(["childPlans", childId, formattedDate], getChildPlans)
}

export default useGetChildPlans
