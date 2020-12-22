import { useQuery } from "react-query"
import { useQueryCache } from "../../useQueryCache"
import { getApi } from "../fetchApi"

const KEY = (observationId: string) => ["observation", observationId]

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
  visibleToGuardians: boolean
}
const useGetObservation = (observationId: string) => {
  const getObservation = getApi<Observation>(`/observations/${observationId}`)
  return useQuery(KEY(observationId), getObservation, {
    refetchOnWindowFocus: false,
  })
}

export const useGetObservationCache = (observationId: string) =>
  useQueryCache<Observation>(KEY(observationId))

export default useGetObservation
