import { useQuery } from "react-query"
import { Assessment } from "../../../domain/assessments"
import { getApi } from "../fetchApi"

interface Response {
  areaId: string
  materialName: string
  materialId: string
  assessment: Assessment
  updatedAt: string
}

const useGetStudentReportAssessmentByArea = (
  reportId: string,
  studentId: string,
  areaId: string
) => {
  const getStudentReportAssessmentByArea = getApi<Response[]>(
    `/progress-reports/${reportId}/students/${studentId}/areas/${areaId}/assessments`
  )
  return useQuery(
    ["reportAreaAssessments", reportId, studentId, areaId],
    getStudentReportAssessmentByArea
  )
}

export default useGetStudentReportAssessmentByArea
