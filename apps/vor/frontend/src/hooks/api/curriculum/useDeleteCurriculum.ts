import { useMutation } from "react-query"
import { track } from "../../../analytics"
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
      track("Curriculum Deleted")
      await curriculumCache.invalidate()
      areasCache.setData([])
    },
  })
}

export default useDeleteCurriculum
