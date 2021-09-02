import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { patchApi } from "../fetchApi"
import { useGetStudentMaterialProgressCache } from "../useGetStudentAssessments"

interface RequestBody {
  stage: number
}

const usePatchAssessments = (studentId: string, materialId: string) => {
  const cache = useGetStudentMaterialProgressCache(studentId)
  const patchStudentMaterialProgress = patchApi<RequestBody>(
    `/students/${studentId}/materialsProgress/${materialId}`
  )

  return useMutation(patchStudentMaterialProgress, {
    onSuccess: async (data) => {
      track("Student Material Progress Updated")
      if (!data) return
      const result = await data.json()

      // populate cache if empty
      const oldData = cache.getData()
      if (!oldData) {
        cache.setData([result])
        return
      }

      // if assessments exists in cache, update it
      const newData = [...oldData]
      const idx = newData.findIndex((m) => materialId === m.materialId)
      if (idx >= 0) {
        newData[idx] = result
        cache.setData(newData)
        return
      }

      // if assessments doesn't exists in cache, create it
      newData.push(result)
      cache.setData(newData)
      await cache.invalidate()
    },
  })
}

export default usePatchAssessments
