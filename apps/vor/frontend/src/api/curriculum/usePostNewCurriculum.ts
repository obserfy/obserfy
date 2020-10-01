import { useMutation } from "react-query"
import { postApi } from "../fetchApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { invalidateGetCurriculumCache } from "../useGetCurriculum"
import { invalidateGetCurriculumAreasCache } from "../useGetCurriculumAreas"

interface UsePostNewCurriculumRequestBody {
  template: "montessori" | "custom"
  name?: string
}
const usePostNewCurriculum = () => {
  const schoolId = getSchoolId()
  const postCreateDefaultCurriculum = postApi<UsePostNewCurriculumRequestBody>(
    `/schools/${schoolId}/curriculums`
  )
  return useMutation(postCreateDefaultCurriculum, {
    onSuccess: async (data, variables) => {
      analytics.track("Curriculum Created", {
        name: variables.name,
        template: variables.template,
      })
      await Promise.all([
        invalidateGetCurriculumCache(),
        invalidateGetCurriculumAreasCache(),
      ])
    },
  })
}

export default usePostNewCurriculum
