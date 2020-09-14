import { queryCache, QueryResult, useQuery } from "react-query"
import { getApi } from "./fetchApi"

export interface Observation {
  id: string
  studentId: string
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
}

export const useGetStudentObservations = (
  studentId: string
): QueryResult<Observation[]> => {
  const getStudentObservations = getApi<Observation[]>(
    `/students/${studentId}/observations`
  )

  return useQuery(
    ["student", studentId, "observations"],
    getStudentObservations
  )
}

export const getStudentObservationsCache = (studentId: string) =>
  queryCache.getQueryData<Observation[]>(["student", studentId, "observations"])

export const updateStudentObservationsCache = (
  studentId: string,
  observations: Observation[]
) =>
  queryCache.setQueryData<Observation[]>(
    ["student", studentId, "observations"],
    observations
  )
