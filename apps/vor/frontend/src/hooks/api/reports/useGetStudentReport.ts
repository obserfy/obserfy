import { useQuery } from "react-query"
import { StudentReport } from "../../../__generated__/models"
import { useQueryCache } from "../../useQueryCache"
import { getApi } from "../fetchApi"

const getStudentReport = (reportId: string, studentId: string) => async () => {
  return getApi<StudentReport>(
    `/progress-reports/${reportId}/students/${studentId}`
  )()
}

const useGetStudentReport = (reportId: string, studentId: string) => {
  return useQuery(
    ["report", reportId, studentId],
    getStudentReport(reportId, studentId)
  )
}

export const useGetStudentReportCache = (
  reportId: string,
  studentId: string
) => {
  return useQueryCache<StudentReport>(["report", reportId, studentId])
}

export default useGetStudentReport
