import { useMutation } from "react-query"
import { postApi } from "../fetchApi"
import { useProgressReportCache } from "./useGetProgressReport"

interface PatchRequestBody {
  published: boolean
}

const usePostReportPublished = (reportId: string) => {
  const cache = useProgressReportCache(reportId)
  const patchReport = postApi<PatchRequestBody>(
    `/progress-reports/${reportId}/published`
  )

  return useMutation(patchReport, {
    onSuccess: async () => {
      await cache.invalidate()
    },
  })
}

export default usePostReportPublished
