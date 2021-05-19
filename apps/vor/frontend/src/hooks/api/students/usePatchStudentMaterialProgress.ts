import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { patchApi } from "../fetchApi"
import { useGetStudentMaterialProgressCache } from "../useGetStudentAssessments"

interface RequestBody {
  stage: number
}
const usePatchStudentMaterialProgress = (
  studentId: string,
  materialId: string
) => {
  const cache = useGetStudentMaterialProgressCache(studentId)
  const patchStudentMaterialProgress = patchApi<RequestBody>(
    `/students/${studentId}/materialsProgress/${materialId}`
  )

  return useMutation(patchStudentMaterialProgress, {
    onSuccess: async (data) => {
      track("Student Material Progress Updated")
      if (data === undefined) return
      const old = cache.getData()
      const materialIndex = old?.findIndex(
        (material) => materialId === material.materialId
      )
      const result = await data.json()

      // populate cache if empty
      if (old === undefined) {
        cache.setData([result])
        return
      }

      // if material progress exists in cache, update it
      if (materialIndex !== undefined && materialIndex >= 0) {
        old[materialIndex] = result
        cache.setData(old)
        return
      }

      // if material progress doesn't exists in cache, create it
      old.push(result)
      cache.setData(old)
    },
  })
}

export default usePatchStudentMaterialProgress
