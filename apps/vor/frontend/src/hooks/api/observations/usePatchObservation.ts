import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { patchApi } from "../fetchApi"
import { Dayjs } from "../../../dayjs"
import { useGetObservationCache } from "./useGetObservation"

interface RequestBody {
  longDesc?: string
  shortDesc?: string
  eventTime?: Dayjs
  areaId?: string
  categoryId?: string
  visibleToGuardians?: boolean
}
const usePatchObservation = (observationId: string, onError?: () => void) => {
  const cache = useGetObservationCache(observationId)
  const patchObservation = patchApi<RequestBody>(
    `/observations/${observationId}`
  )
  return useMutation(patchObservation, {
    onSuccess: async (response) => {
      track("Observation Updated")
      if (response === undefined) return
      const body = await response.json()
      cache.setData(body)
    },
    onError,
  })
}

export default usePatchObservation
