import { Dayjs } from "dayjs"
import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"

interface RequestBody {
  title?: string
  periodStart?: Dayjs
  periodEnd?: Dayjs
}

const usePatchReport = (reportId: string) => {
  const patchReport = patchApi<RequestBody>(`/progress-report/${reportId}`)
  return useMutation(patchReport)
}

export default usePatchReport
