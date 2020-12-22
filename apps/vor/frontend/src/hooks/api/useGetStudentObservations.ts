import { useQuery } from "react-query"
import { useQueryCache } from "../useQueryCache"
import { getApi } from "./fetchApi"

export interface Observation {
  id: string
  studentName: string
  shortDesc: string
  longDesc: string
  categoryId: string
  createdDate?: string
  creatorId?: string
  creatorName?: string
  eventTime?: string
  area?: {
    id: string
    name: string
  }
  images: Array<{
    id: string
    thumbnailUrl: string
    originalUrl: string
  }>
  visibleToGuardians: boolean
}
export const useGetStudentObservations = (studentId: string) => {
  const getStudentObservations = getApi<Observation[]>(
    `/students/${studentId}/observations`
  )

  return useQuery(KEY(studentId), getStudentObservations)
}

export const useGetStudentObservationsCache = (studentId: string) => {
  return useQueryCache<Observation[]>(KEY(studentId))
}

const KEY = (studentId: string) => ["student", studentId, "observations"]
