import { QueryResult, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"

export interface Material {
  id: string
  name: string
  order: number
}
export function useGetSubjectMaterials(
  subjectId: string
): QueryResult<Material[], {}> {
  const fetchSubjectMaterials = fetchApi<Material[]>(
    `/curriculum/subjects/${subjectId}/materials`
  )
  return useQuery<Material[], {}>(
    ["materials", subjectId],
    fetchSubjectMaterials
  )
}
