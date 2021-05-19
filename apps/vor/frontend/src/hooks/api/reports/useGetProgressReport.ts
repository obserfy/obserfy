import dayjs from "dayjs"
import { useQuery } from "react-query"
import { ProgressReport } from "../../../__generated__/models"
import { getApi } from "../fetchApi"

const getProgressReport = (reportId: string) => async () => {
  const result = await getApi<ProgressReport>(`/progress-reports/${reportId}`)()
  const periodStart = dayjs(result.periodStart)
  const periodEnd = dayjs(result.periodEnd)

  return { ...result, periodStart, periodEnd }
}

const useGetProgressReport = (reportId: string) => {
  return useQuery(["report", reportId], getProgressReport(reportId))
}

export default useGetProgressReport
