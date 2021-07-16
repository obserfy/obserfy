import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import { useGetSubjectMaterialsCache } from "../useGetSubjectMaterials"

const useDeleteMaterial = (materialId: string, subjectId: string) => {
  const cache = useGetSubjectMaterialsCache(subjectId)
  const deleteMaterial = deleteApi(`/curriculums/materials/${materialId}`)
  return useMutation(deleteMaterial, {
    onSuccess: async () => {
      const data = cache.getData()
      if (data) {
        const materialIdx = data.findIndex((m) => m.id === materialId)
        const newData = [...data]
        newData.splice(materialIdx, 1)
        cache.setData(newData)
      }
    },
  })
}

export default useDeleteMaterial
