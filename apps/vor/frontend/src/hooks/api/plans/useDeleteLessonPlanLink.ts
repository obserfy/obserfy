import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import { useGetPlanCache } from "./useGetPlan"

const useDeleteLessonPlanLink = (linkId: string, lessonPlanId: string) => {
  const cache = useGetPlanCache(lessonPlanId)
  const deleteLessonPlanLink = deleteApi(`/links/${linkId}`)

  return useMutation(deleteLessonPlanLink, {
    onSuccess: async () => {
      analytics.track("Plan Link Deleted")
      await cache.invalidate()
    },
  })
}

export default useDeleteLessonPlanLink
