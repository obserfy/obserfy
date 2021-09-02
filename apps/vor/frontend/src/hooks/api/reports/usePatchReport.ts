import { useMutation } from "react-query"
import dayjs, { Dayjs } from "../../../dayjs"
import { patchApi } from "../fetchApi"
import { useProgressReportCache } from "./useGetProgressReport"

interface RequestBody {
  title?: string
  periodStart?: Dayjs
  periodEnd?: Dayjs
}

const usePatchReport = (reportId: string) => {
  const cache = useProgressReportCache(reportId)
  const patchReport = patchApi<RequestBody>(`/progress-reports/${reportId}`)
  return useMutation(patchReport, {
    onSuccess: async (data) => {
      const report = cache.getData()
      if (data && report) {
        const response = await data.json()

        cache.setData({
          ...report,
          title: response.title,
          periodStart: dayjs(response.periodStart),
          periodEnd: dayjs(response.periodEnd),
        })

        await cache.refetchQueries()
      }
    },
  })
}

export default usePatchReport
