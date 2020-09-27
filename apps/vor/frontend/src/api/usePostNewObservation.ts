import { useMutation } from "react-query"
import { postApi } from "./fetchApi"
import {
  getStudentObservationsCache,
  updateStudentObservationsCache,
} from "./useGetStudentObservations"
import { Dayjs } from "../dayjs"

interface PostNewObservationBody {
  shortDesc: string
  longDesc?: string
  categoryId?: string
  images?: string[]
  eventTime?: Dayjs
  areaId?: string
}
const usePostNewObservation = (studentId: string) => {
  const postNewObservation = postApi<PostNewObservationBody>(
    `/students/${studentId}/observations`
  )
  return useMutation(postNewObservation, {
    onSuccess: async (data) => {
      if (data === undefined) return
      const newObservation = await data.json()
      const observations = getStudentObservationsCache(studentId) ?? []
      observations.push(newObservation)
      updateStudentObservationsCache(studentId, observations)
    },
  })
}

export default usePostNewObservation
