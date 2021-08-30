import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { useProgressReportCache } from "./useGetProgressReport"

interface PatchRequestBody {
  published: boolean
}

const usePatchReport = (reportId: string) => {
  const cache = useProgressReportCache(reportId)
  const patchReport = patchApi<PatchRequestBody>(
    `/progress-reports/${reportId}`
  )

  return useMutation(patchReport, {
    onSuccess: async () => {
      await cache.invalidate()
    },
  })
}

export default usePatchReport
