import { useMutation } from "react-query"
import { putApi } from "../fetchApi"
import { useGetStudentReportCache } from "./useGetStudentReport"

const usePutReportStudentAreaComments = (
  reportId: string,
  studentId: string,
  areaId: string
) => {
  const cache = useGetStudentReportCache(reportId, studentId)
  const putReportStudentAreaComments = putApi<{ comments: string }>(
    `/progress-reports/${reportId}/students/${studentId}/areas/${areaId}/comments`
  )
  return useMutation(putReportStudentAreaComments, {
    onSuccess: async () => {
      await cache.invalidate()
    },
  })
}

export default usePutReportStudentAreaComments
