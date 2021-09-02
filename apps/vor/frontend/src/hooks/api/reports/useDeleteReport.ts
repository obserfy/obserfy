import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import { useGetProgressReportsCache } from "../useGetProgressReports"

const useDeleteReport = (reportId: string) => {
  const cache = useGetProgressReportsCache(reportId)
  const deleteReport = deleteApi(`/progress-reports/${reportId}`)

  return useMutation(deleteReport, {
    onSuccess: async () => {
      await cache.invalidate()
    },
  })
}

export default useDeleteReport
