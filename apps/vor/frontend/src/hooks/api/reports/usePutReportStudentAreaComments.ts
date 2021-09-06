import { useMutation } from "react-query"
import { putApi } from "../fetchApi"

const usePutReportStudentAreaComments = (
  reportId: string,
  studentId: string,
  areaId: string
) => {
  const putReportStudentAreaComments = putApi<{ comments: string }>(
    `/progress-reports/${reportId}/students/${studentId}/areas/${areaId}/comments`
  )
  return useMutation(putReportStudentAreaComments)
}

export default usePutReportStudentAreaComments
