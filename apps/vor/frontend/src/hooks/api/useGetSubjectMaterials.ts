import { useQuery } from "react-query"
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
  return useQuery(["materials", subjectId], fetchSubjectMaterials)
}

export const useGetSubjectMaterialsCache = (subjectId: string) => {
  return useQueryCache<Material[]>(["materials", subjectId])
}
