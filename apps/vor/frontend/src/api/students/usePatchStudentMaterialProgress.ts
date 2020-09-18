import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import {
  getStudentMaterialProgressCache,
  setStudentMaterialProgressCache,
} from "../useGetStudentMaterialProgress"

interface RequestBody {
  stage: number
}
const usePatchStudentMaterialProgress = (
  studentId: string,
  materialId: string
) => {
  const patchStudentMaterialProgress = patchApi<RequestBody>(
    `/students/${studentId}/materialsProgress/${materialId}`
  )

  return useMutation(patchStudentMaterialProgress, {
    onSuccess: async (data) => {
      const cache = getStudentMaterialProgressCache(studentId)
      const materialIndex = cache?.findIndex(
        (material) => materialId === material.materialId
      )
      const result = await data.json()
      if (cache && materialIndex !== undefined && materialIndex >= 0) {
        const cacheItem = cache[materialIndex]
        if (cacheItem) {
          cache[materialIndex] = result
        } else {
          cache.push(result)
        }
        setStudentMaterialProgressCache(studentId, cache)
      }
    },
  })
}

export default usePatchStudentMaterialProgress
