import { QueryState, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"

export interface Material {
  id: string
  name: string
  order: number
}
export function useGetSubjectMaterials(
  subjectId: string
): QueryState<Material[]> {
  const fetchSubjectMaterials = fetchApi<Material[]>(
    `/curriculum/subjects/${subjectId}/materials`
  )
  return useQuery(["materials", subjectId], fetchSubjectMaterials)
}
