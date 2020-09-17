import { useMutation } from "react-query"
import { BASE_URL } from "../useApi"
import {
  getObservationCache,
  updateObservationCache,
} from "./useGetObservation"

const usePostNewObservationImage = (observationId: string) => {
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
      const result = await data.json()
      const cached = await getObservationCache(observationId)
      if (cached) {
        cached?.images?.push(result)
        updateObservationCache(cached)
      }
    },
  })
}

export default usePostNewObservationImage
