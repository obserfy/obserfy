import { queryCache, useQuery } from "react-query"
import { getApi } from "../fetchApi"

interface Observation {
  id: string
  studentName: string
  categoryId: string
  creatorId: string
  creatorName: string
  longDesc: string
  shortDesc: string
  createdDate: string
  eventTime: string
  area?: {
    id: string
    name: string
  }
  images: Array<{
    id: string
    originalUrl: string
    thumbnailUrl: string
  }>
}
const useGetObservation = (observationId: string) => {
  const getObservation = getApi<Observation>(`/observations/${observationId}`)
  return useQuery(["observation", observationId], getObservation)
}

export const updateObservationCache = (observation: Observation) => {
  queryCache.setQueryData<Observation>(
    ["observation", observation.id],
    observation
  )
}

export default useGetObservation
