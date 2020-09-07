import { useMutation } from "react-query"
import { postApi } from "./fetchApi"
import { invalidateStudentObservations } from "./useGetStudentObservations"

interface PostNewObservationBody {
  categoryId: string
  longDesc: string
  shortDesc: string
}
const usePostNewObservation = (studentId: string) => {
  const postNewObservation = postApi<PostNewObservationBody>(
    `/students/${studentId}/observations`
  )
  return useMutation(postNewObservation, {
    onSuccess: async () => {
      await invalidateStudentObservations(studentId)
    },
  })
}

export default usePostNewObservation
