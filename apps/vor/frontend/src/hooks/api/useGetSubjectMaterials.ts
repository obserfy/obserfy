import { useQuery } from "react-query"
import { compareOrder } from "../../domain/array"
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
  return useQuery(["materials", subjectId], fetchSubjectMaterials, {
    onSuccess: (data) => data.sort(compareOrder),
  })
}
