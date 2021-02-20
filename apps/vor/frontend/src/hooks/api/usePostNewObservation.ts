import { useMutation } from "react-query"
import { track } from "../../analytics"
import { postApi } from "./fetchApi"
import { Dayjs } from "../../dayjs"
import { useGetStudentObservationsCache } from "./useGetStudentObservations"

interface PostNewObservationBody {
  shortDesc: string
  longDesc?: string
  categoryId?: string
  images?: string[]
  eventTime?: Dayjs
  areaId?: string
  visibleToGuardians?: boolean
}
const usePostNewObservation = (studentId: string) => {
  const cache = useGetStudentObservationsCache(studentId)
  const postNewObservation = postApi<PostNewObservationBody>(
    `/students/${studentId}/observations`
  )
  return useMutation(postNewObservation, {
    onSuccess: async (data) => {
      track("Observation Created")
      if (data === undefined) return
      const newObservation = await data.json()

      const observations = cache.getData() ?? []
      observations.push(newObservation)
      cache.setData(observations)
    },
  })
}

export default usePostNewObservation
