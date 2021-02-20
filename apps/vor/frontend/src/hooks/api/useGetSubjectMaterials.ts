import { useQuery } from "react-query"
import { compareOrder } from "../../domain/array"
import { useQueryCache } from "../useQueryCache"
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

export const useGetSubjectMaterialsCache = (subjectId: string) => {
  return useQueryCache<Material[]>(["materials", subjectId])
}
