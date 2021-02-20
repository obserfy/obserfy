import { useMutation, useQueryClient } from "react-query"
import { track } from "../../../analytics"
import { postApi } from "../fetchApi"

interface Link {
  url: string
  title?: string
  description?: string
  image?: string
}
const usePostNewLessonPlanLink = (lessonPlanId: string) => {
  const queryCache = useQueryClient()
  const postNewLessonPlanLink = postApi<Link>(`/plans/${lessonPlanId}/links`)
  return useMutation(postNewLessonPlanLink, {
    onSuccess: async () => {
      track("Plan Link Created")
      await queryCache.invalidateQueries(["plan", lessonPlanId])
    },
  })
}

export default usePostNewLessonPlanLink
