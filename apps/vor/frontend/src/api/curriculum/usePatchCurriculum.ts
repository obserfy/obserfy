import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { setCurriculumCache } from "../useGetCurriculum"

interface PatchCurriculumRequest {
  name: string
}
const usePatchCurriculum = (curriculumId: string) => {
  const patchCurriculum = patchApi<PatchCurriculumRequest>(
    `/curriculums/${curriculumId}`
  )
  return useMutation(patchCurriculum, {
    onSuccess: async (data) => {
      if (data) {
        const updatedCurriculum = await data.json()
        setCurriculumCache(updatedCurriculum)
      }
    },
  })
}

export default usePatchCurriculum
