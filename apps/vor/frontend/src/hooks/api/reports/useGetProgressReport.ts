import { useQuery } from "react-query"
import {
  ProgressReport,
  School,
  StudentReport,
} from "../../../__generated__/models"
import dayjs from "../../../dayjs"
import { useQueryCache } from "../../useQueryCache"
import { getApi } from "../fetchApi"

const getProgressReport = (reportId: string) => async () => {
  const result = await getApi<{
    id: string
    title: string
    periodStart: string
    periodEnd: string
    school?: School
    studentsReports: StudentReport[]
    published: boolean
  }>(`/progress-reports/${reportId}`)()
  const periodStart = dayjs(result.periodStart)
  const periodEnd = dayjs(result.periodEnd)

  return {
    ...result,
    periodStart,
    periodEnd,
  }
}

const useGetProgressReport = (reportId: string) => {
  return useQuery(["report", reportId], getProgressReport(reportId))
}

export const useProgressReportCache = (reportId: string) => {
  return useQueryCache<ProgressReport>(["report", reportId])
}

export default useGetProgressReport
