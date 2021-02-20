import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { postApi } from "../fetchApi"
import { getSchoolId } from "../../schoolIdState"
import { useGetCurriculumCache } from "../useGetCurriculum"
import { useGetCurriculumAreasCache } from "../useGetCurriculumAreas"

interface UsePostNewCurriculumRequestBody {
  template: "montessori" | "custom"
  name?: string
}
const usePostNewCurriculum = () => {
  const curriculumCache = useGetCurriculumCache()
  const areaCache = useGetCurriculumAreasCache()

  const schoolId = getSchoolId()
  const postCreateDefaultCurriculum = postApi<UsePostNewCurriculumRequestBody>(
    `/schools/${schoolId}/curriculums`
  )
  return useMutation(postCreateDefaultCurriculum, {
    onSuccess: async (data, variables) => {
      track("Curriculum Created", {
        name: variables.name,
        template: variables.template,
      })
      await Promise.all([curriculumCache.invalidate(), areaCache.invalidate()])
    },
  })
}

export default usePostNewCurriculum
