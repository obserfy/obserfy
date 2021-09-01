import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"

const useDeleteReport = (reportId: string) => {
  const deleteReport = deleteApi(`/progress-report/${reportId}`)

  return useMutation(deleteReport)
}

export default useDeleteReport
