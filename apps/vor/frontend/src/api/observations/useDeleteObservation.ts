import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"

const useDeleteObservation = (observationId: string) => {
  const deleteObservation = deleteApi(`/observations/${observationId}`)
  return useMutation(deleteObservation)
}

export default useDeleteObservation
