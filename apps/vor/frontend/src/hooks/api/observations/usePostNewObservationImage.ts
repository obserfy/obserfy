import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { BASE_URL } from "../useApi"
import { useGetObservationCache } from "./useGetObservation"

const usePostNewObservationImage = (observationId: string) => {
  const cache = useGetObservationCache(observationId)
  const postNewImage = async (image: File) => {
    const payload = new FormData()
    payload.append("image", image)

    return fetch(`${BASE_URL}/observations/${observationId}/images`, {
      credentials: "same-origin",
      method: "POST",
      body: payload,
    })
  }

  return useMutation(postNewImage, {
    onSuccess: async (data) => {
      track("Observation Image Uploaded")
      const result = await data.json()
      const cached = await cache.getData()
      if (cached) {
        if (cached.images?.length) {
          cached.images.push(result)
        } else {
          cached.images = [result]
        }
        cache.setData(cached)
      }
    },
  })
}

export default usePostNewObservationImage
