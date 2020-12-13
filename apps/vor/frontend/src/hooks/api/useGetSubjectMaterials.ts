import { useQuery } from "react-query"
import { getApi } from "./fetchApi"

export interface Material {
  id: string
  name: string
  order: number
}
export function useGetSubjectMaterials(subjectId: string) {
  const fetchSubjectMaterials = getApi<Material[]>(
    `/curriculums/subjects/${subjectId}/materials`
  )
  return useQuery(["materials", subjectId], fetchSubjectMaterials)
}
