import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { useGetCurriculumAreasCache } from "../useGetCurriculumAreas"

interface PatchCurriculumRequest {
  name: string
}
const usePatchCurriculum = (curriculumId: string) => {
  const curriculumCache = useGetCurriculumAreasCache()
  const patchCurriculum = patchApi<PatchCurriculumRequest>(
    `/curriculums/${curriculumId}`
  )
  return useMutation(patchCurriculum, {
    onSuccess: async (data) => {
      analytics.track("Curriculum Updated")
      if (data) {
        const updatedCurriculum = await data.json()
        curriculumCache.setData(updatedCurriculum)
      }
    },
  })
}

export default usePatchCurriculum
