import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import {
  getObservationCache,
  updateObservationCache,
} from "./useGetObservation"

const useDeleteObservationImage = (observationId: string, imageId?: string) => {
  const deleteObservationImage = deleteApi(`/images/${imageId}`)

  return useMutation(deleteObservationImage, {
    onSuccess: async () => {
      analytics.track("Observation Image Deleted")
      const cached = await getObservationCache(observationId)
      if (cached && cached.images.length > 0) {
        cached.images =
          cached.images?.filter((image) => image.id !== imageId) ?? []
        updateObservationCache(cached)
      }
    },
  })
}

export default useDeleteObservationImage
