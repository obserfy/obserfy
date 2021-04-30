import { useQuery } from "react-query"
import { ProgressReport } from "../../../__generated__/models"
import { getApi } from "../fetchApi"

const useGetProgressReport = (reportId: string) => {
  const getProgressReport = getApi<ProgressReport>(
    `/progress-reports/${reportId}`
  )

  return useQuery(["report", reportId], getProgressReport)
}

export default useGetProgressReport
