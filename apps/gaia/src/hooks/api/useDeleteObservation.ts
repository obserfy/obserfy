import { queryCache, useMutation } from "react-query"
import { deleteApi } from "../../apiHelpers"

const useDeleteObservation = (id: string) => {
  const deleteObservation = deleteApi(`/observations/${id}`)
  return useMutation(deleteObservation, {
    onSuccess: () => queryCache.invalidateQueries(["plans"]),
  })
}

export default useDeleteObservation
