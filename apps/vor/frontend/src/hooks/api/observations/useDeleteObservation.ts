import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { deleteApi } from "../fetchApi"
import { useGetStudentObservationsCache } from "../useGetStudentObservations"

const useDeleteObservation = (observationId: string, studentId: string) => {
  const cache = useGetStudentObservationsCache(studentId)
  const deleteObservation = deleteApi(`/observations/${observationId}`)
  return useMutation(deleteObservation, {
    onSuccess: async () => {
      track("Observation Deleted")
      const observations = cache.getData()

      cache.setData(
        observations?.filter(({ id }) => id !== observationId) ?? []
      )
    },
  })
}

export default useDeleteObservation
