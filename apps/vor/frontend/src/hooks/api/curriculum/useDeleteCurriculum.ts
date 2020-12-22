import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import { getSchoolId } from "../../schoolIdState"
import { useGetCurriculumCache } from "../useGetCurriculum"
import { useGetCurriculumAreasCache } from "../useGetCurriculumAreas"

const useDeleteCurriculum = () => {
  const curriculumCache = useGetCurriculumCache()
  const areasCache = useGetCurriculumAreasCache()

  const deleteCurriculum = deleteApi(`/schools/${getSchoolId()}/curriculums`)
  return useMutation(deleteCurriculum, {
    onSuccess: async () => {
      analytics.track("Curriculum Deleted")
      await curriculumCache.invalidate()
      areasCache.setData([])
    },
  })
}

export default useDeleteCurriculum
