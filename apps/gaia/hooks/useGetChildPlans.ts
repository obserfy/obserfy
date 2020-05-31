import { useQuery } from "react-query"
import { Dayjs } from "../utils/dayjs"

const useGetChildPlans = (childId: string, date: Dayjs) => {
  const formattedDate = date.format("YYYY-DD-MM")
  const getChildPlans = async () => {
    const result = await fetch(
      `/api/child/${childId}/plans?date=${formattedDate}`,
      { credentials: "same-origin" }
    )

    return result.json()
  }
  return useQuery(["childPlans", childId, formattedDate], getChildPlans)
}

export default useGetChildPlans
