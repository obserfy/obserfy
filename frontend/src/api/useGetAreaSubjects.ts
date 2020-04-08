import { QueryResult, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"

export interface Subject {
  id: string
  name: string
  order: number
}
export function useGetAreaSubjects(areaId: string): QueryResult<Subject[]> {
  const fetchAreaSubjects = fetchApi<Subject[]>(
    `/curriculum/areas/${areaId}/subjects`
  )
  return useQuery(["area_subjects", areaId], fetchAreaSubjects)
}
