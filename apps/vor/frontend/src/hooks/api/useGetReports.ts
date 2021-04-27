import { useQuery } from "react-query"
import { getSchoolId } from "../schoolIdState"
import { getApi } from "./fetchApi"

const useGetReports = () => {
  const schoolId = getSchoolId()
  const getReports = getApi(`/schools/${schoolId}/reports`)

  return useQuery([schoolId, "reports"], getReports)
}

export default useGetReports
