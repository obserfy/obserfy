import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { deleteApi } from "../fetchApi"
import { useGetObservationCache } from "./useGetObservation"

const useDeleteObservationImage = (observationId: string, imageId?: string) => {
  const cache = useGetObservationCache(observationId)
  const deleteObservationImage = deleteApi(`/images/${imageId}`)

  return useMutation(deleteObservationImage, {
    onSuccess: async () => {
      track("Observation Image Deleted")
      const cached = await cache.getData()
      if (cached && cached.images.length > 0) {
        cached.images =
          cached.images?.filter((image) => image.id !== imageId) ?? []
        cache.setData(cached)
      }
    },
  })
}

export default useDeleteObservationImage
