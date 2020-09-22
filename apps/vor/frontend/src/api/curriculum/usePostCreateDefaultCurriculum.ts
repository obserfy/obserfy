import { useMutation } from "react-query"
import { postApi } from "../fetchApi"
import { getSchoolId } from "../../hooks/schoolIdState"
import { invalidateGetCurriculumCache } from "../useGetCurriculum"
import { invalidateGetCurriculumAreasCache } from "../useGetCurriculumAreas"

const usePostCreateDefaultCurriculum = () => {
  const schoolId = getSchoolId()
  const postCreateDefaultCurriculum = postApi<undefined>(
    `/schools/${schoolId}/curriculums`
  )
  return useMutation(postCreateDefaultCurriculum, {
    onSuccess: async () => {
      await Promise.all([
        invalidateGetCurriculumCache(),
        invalidateGetCurriculumAreasCache(),
      ])
    },
  })
}

export default usePostCreateDefaultCurriculum
