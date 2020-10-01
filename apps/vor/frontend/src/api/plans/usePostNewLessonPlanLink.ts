import { queryCache, useMutation } from "react-query"
import { postApi } from "../fetchApi"

interface Link {
  url: string
  title?: string
  description?: string
  image?: string
}
const usePostNewLessonPlanLink = (lessonPlanId: string) => {
  const postNewLessonPlanLink = postApi<Link>(`/plans/${lessonPlanId}/links`)
  return useMutation(postNewLessonPlanLink, {
    onSuccess: async () => {
      analytics.track("Plan Link Created")
      await queryCache.invalidateQueries(["plan", lessonPlanId])
    },
  })
}

export default usePostNewLessonPlanLink
