import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"

const useDeleteReport = (reportId: string) => {
  const deleteReport = deleteApi(`/progress-reports/${reportId}`)

  return useMutation(deleteReport)
}

export default useDeleteReport
