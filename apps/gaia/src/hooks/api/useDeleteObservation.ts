import { useMutation } from "react-query"
import { deleteApi } from "./apiHelpers"
import { useGetChildPlansCache } from "./useGetDailyLessonPlans"

const useDeleteObservation = (id: string) => {
  const cache = useGetChildPlansCache()
  const deleteObservation = deleteApi(`/observations/${id}`)

  return useMutation(deleteObservation, {
    onSuccess: () => cache.invalidateAll(),
  })
}

export default useDeleteObservation
