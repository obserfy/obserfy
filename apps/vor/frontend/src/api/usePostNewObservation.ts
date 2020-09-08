import { useMutation } from "react-query"
import { postApi } from "./fetchApi"
import { invalidateStudentObservations } from "./useGetStudentObservations"
import { Dayjs } from "../dayjs"

interface PostNewObservationBody {
  shortDesc: string
  longDesc?: string
  categoryId?: string
  images?: string[]
  eventTime?: Dayjs
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
