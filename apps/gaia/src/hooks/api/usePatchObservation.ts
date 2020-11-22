import { queryCache, useMutation } from "react-query"
import { patchApi } from "./apiHelpers"
import { PatchObservationRequestBody } from "../../pages/api/observations/[observationId]"

const usePatchObservation = (id: string) => {
  const patchObservation = patchApi<PatchObservationRequestBody>(
    `/observations/${id}`
  )
  return useMutation(patchObservation, {
    onSuccess: () => queryCache.invalidateQueries(["childPlans"]),
  })
}

export default usePatchObservation
