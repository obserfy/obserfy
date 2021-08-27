import { useQuery } from "react-query"
import { StudentReport } from "../../../__generated__/models"
import { getApi } from "../fetchApi"

const getStudentReport = (reportId: string, studentId: string) => async () => {
  return getApi<StudentReport>(
    `/progress-reports/${reportId}/students/${studentId}`
  )()
}

const useGetStudentReport = (reportId: string, studentId: string) => {
  return useQuery(["report", reportId], getStudentReport(reportId, studentId))
}

export default useGetStudentReport
