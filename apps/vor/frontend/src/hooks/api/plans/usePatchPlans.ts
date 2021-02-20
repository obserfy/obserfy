import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { patchApi } from "../fetchApi"
import { Dayjs } from "../../../dayjs"
import { useGetPlanCache } from "./useGetPlan"

interface PatchPlanPayload {
  title?: string
  description?: string
  classId?: string
  date?: Dayjs
  areaId?: string
}
const usePatchPlan = (planId: string) => {
  const cache = useGetPlanCache(planId)
  const patchPlan = patchApi<PatchPlanPayload>(`/plans/${planId}`)

  return useMutation(patchPlan, {
    onSuccess: async () => {
      track("Plan Updated")
      await cache.invalidate()
    },
  })
}

export default usePatchPlan
