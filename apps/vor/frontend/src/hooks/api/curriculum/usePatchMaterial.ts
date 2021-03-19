import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { useGetSubjectMaterialsCache } from "../useGetSubjectMaterials"
import { useGetMaterialCache } from "./useGetMaterial"

const usePatchMaterial = (materialId: string, subjectId: string) => {
  const materialCache = useGetMaterialCache(materialId)
  const subjectMaterialsCache = useGetSubjectMaterialsCache(subjectId)
  const patchMaterial = patchApi(`/curriculums/materials/${materialId}`)

  return useMutation(patchMaterial, {
    onSuccess: async () => {
      await Promise.all([
        materialCache.invalidate(),
        subjectMaterialsCache.invalidate(),
      ])
    },
  })
}

export default usePatchMaterial
