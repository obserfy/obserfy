import { navigate } from "gatsby"
import { queryCache, QueryResult, useQuery } from "react-query"
import { BASE_URL } from "./useApi"

export interface Observation {
  id?: string
  studentId?: string
  studentName?: string
  shortDesc: string
  longDesc: string
  categoryId: string
  createdDate?: string
  creatorId?: string
  creatorName?: string
  eventTime?: string
}

export const useGetStudentObservations = (
  studentId: string
): QueryResult<Observation[]> => {
  async function fetchObservation(): Promise<Observation[]> {
    const url = `/students/${studentId}/observations`
    const result = await fetch(`${BASE_URL}${url}`, {
      credentials: "same-origin",
    })

    // Throw user to login when something gets 401
    if (result.status === 401) {
      await navigate("/login")
      return []
    }

    return result.json()
  }

  return useQuery(["observations", { studentId }], fetchObservation)
}

export const invalidateStudentObservations = async (studentId: string) =>
  queryCache.invalidateQueries<Observation[]>(["observations", { studentId }])
