import { QueryResult, useQuery } from "react-query"
import { getApi } from "./fetchApi"

export interface Subject {
  id: string
  name: string
  order: number
}
export function useGetAreaSubjects(areaId: string): QueryResult<Subject[]> {
  const fetchAreaSubjects = getApi<Subject[]>(
    `/curriculums/areas/${areaId}/subjects`
  )
  return useQuery(["area_subjects", areaId], fetchAreaSubjects)
}
