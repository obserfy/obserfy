import { queryCache, useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { Dayjs } from "../../dayjs"

interface PatchPlanPayload {
  title?: string
  description?: string
  classId?: string
  date?: Dayjs
  areaId?: string
}
const usePatchPlan = (planId: string) => {
  const patchPlan = patchApi<PatchPlanPayload>("/plans", planId)

  return useMutation(patchPlan, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(["plan", planId])
    },
  })
}

export default usePatchPlan
