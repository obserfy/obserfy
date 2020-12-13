import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import {
  getStudentObservationsCache,
  updateStudentObservationsCache,
} from "../useGetStudentObservations"

const useDeleteObservation = (observationId: string, studentId: string) => {
  const deleteObservation = deleteApi(`/observations/${observationId}`)
  return useMutation(deleteObservation, {
    onSuccess: async () => {
      analytics.track("Observation Deleted")
      const observations = getStudentObservationsCache(studentId)

      updateStudentObservationsCache(
        studentId,
        observations?.filter(({ id }) => id !== observationId) ?? []
      )
    },
  })
}

export default useDeleteObservation
