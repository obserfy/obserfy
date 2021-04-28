import { useQuery } from "react-query"
import { ProgressReport } from "../../__generated__/models"
import { getSchoolId } from "../schoolIdState"
import { getApi } from "./fetchApi"

const useGetReports = () => {
  const schoolId = getSchoolId()
  const getReports = getApi<ProgressReport[]>(`/schools/${schoolId}/reports`)

  return useQuery([schoolId, "reports"], getReports)
}

export default useGetReports
