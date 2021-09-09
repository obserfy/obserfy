import { useQuery } from "react-query"
import { getApi } from "../fetchApi"

interface Response {
  areaId: string
  materialName: string
  materialId: string
  assessments: string
  updatedAt: string
}

const useGetStudentReportAssessmentByArea = (
  reportId: string,
  studentId: string,
  areaId: string
) => {
  const getStudentReportAssessmentByArea = getApi<Response>(
    `/progress-reports/${reportId}/students/${studentId}/areas/${areaId}/assessments/`
  )
  return useQuery(
    ["reportAreaAssessments", reportId, studentId, areaId],
    getStudentReportAssessmentByArea
  )
}

export default useGetStudentReportAssessmentByArea
