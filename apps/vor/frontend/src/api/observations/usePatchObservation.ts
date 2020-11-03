import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { Dayjs } from "../../dayjs"
import { updateObservationCache } from "./useGetObservation"

interface RequestBody {
  longDesc?: string
  shortDesc?: string
  eventTime?: Dayjs
  areaId?: string
  categoryId?: string
  visibleToGuardians?: boolean
}
const usePatchObservation = (observationId: string, onError?: () => void) => {
  const patchObservation = patchApi<RequestBody>(
    `/observations/${observationId}`
  )
  return useMutation(patchObservation, {
    onSuccess: async (response) => {
      analytics.track("Observation Updated")
      if (response === undefined) return
      const body = await response.json()
      updateObservationCache(body)
    },
    onError,
  })
}

export default usePatchObservation
