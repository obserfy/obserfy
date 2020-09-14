import { useMutation } from "react-query"
import { putApi } from "../fetchApi"

const usePutObservation = (observationId: string) => {
  const deleteObservation = putApi(`/observations/${observationId}`)
  return useMutation(deleteObservation)
}

export default usePutObservation
