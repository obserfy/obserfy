import { useQuery } from "react-query"
import { ProgressReport } from "../../__generated__/models"
import { getSchoolId } from "../schoolIdState"
import { useQueryCache } from "../useQueryCache"
import { getApi } from "./fetchApi"

const useGetProgressReports = () => {
  const schoolId = getSchoolId()
  const getReports = getApi<ProgressReport[]>(
    `/schools/${schoolId}/progress-reports`
  )

  return useQuery([schoolId, "reports"], getReports)
}

export const useGetProgressReportsCache = (schoolId: string) => {
  return useQueryCache([schoolId, "reports"])
}

export default useGetProgressReports
