import { useMutation } from "react-query"
import { PatchObservationRequestBody } from "../../pages/api/observations/[observationId]"
import { patchApi } from "./apiHelpers"
import { useGetChildPlansCache } from "./useGetDailyLessonPlans"

const usePatchObservation = (id: string) => {
  const cache = useGetChildPlansCache()

  const patchObservation = patchApi<PatchObservationRequestBody>(
    `/observations/${id}`
  )
  return useMutation(patchObservation, {
    onSuccess: () => cache.invalidateAll(),
  })
}

export default usePatchObservation
