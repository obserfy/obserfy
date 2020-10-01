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
      analytics.track("Student Material Progress Updated")
      if (data === undefined) return
      const cache = getStudentMaterialProgressCache(studentId)
      const materialIndex = cache?.findIndex(
        (material) => materialId === material.materialId
      )
      const result = await data.json()

      // populate cache if empty
      if (cache === undefined) {
        setStudentMaterialProgressCache(studentId, [result])
        return
      }

      // if material progress exists in cache, update it
      if (materialIndex !== undefined && materialIndex >= 0) {
        cache[materialIndex] = result
        setStudentMaterialProgressCache(studentId, cache)
        return
      }

      // if material progress doesn't exists in cache, create it
      cache.push(result)
      setStudentMaterialProgressCache(studentId, cache)
    },
  })
}

export default usePatchStudentMaterialProgress
