import { QueryOptions, QueryResult, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"

export interface Material {
  id: string
  name: string
  order: number
}
export function useGetSubjectMaterials(
  subjectId: string,
  options?: QueryOptions<Material[]>
): QueryResult<Material[]> {
  const fetchSubjectMaterials = fetchApi<Material[]>(
    `/curriculum/subjects/${subjectId}/materials`
  )
  return useQuery(["materials", subjectId], fetchSubjectMaterials, options)
}
