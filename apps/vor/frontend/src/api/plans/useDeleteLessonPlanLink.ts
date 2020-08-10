import { queryCache, useMutation } from "react-query"
import { deleteApi } from "../fetchApi"

const useDeleteLessonPlanLink = (linkId: string, lessonPlanId: string) => {
  const deleteLessonPlanLink = deleteApi(`/links/${linkId}`)
  return useMutation(deleteLessonPlanLink, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(["plan", lessonPlanId])
    },
  })
}

export default useDeleteLessonPlanLink
