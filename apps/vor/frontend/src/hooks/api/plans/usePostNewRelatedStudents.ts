import { useMutation } from "react-query"
import { postApi } from "../fetchApi"
import { useGetPlanCache } from "./useGetPlan"

type PostNewRelatedStudentsResponseBody = Array<{
  id: string
  name: string
  profileImageUrl: string
}>
interface PostNewRelatedStudentsRequestBody {
  studentIds: string[]
}
const usePostNewRelatedStudents = (planId: string) => {
  const cache = useGetPlanCache(planId)
  const postNewRelatedStudents = postApi<PostNewRelatedStudentsRequestBody>(
    `/plans/${planId}/students`
  )

  return useMutation(postNewRelatedStudents, {
    onSuccess: async (data) => {
      if (!data) return
      const response: PostNewRelatedStudentsResponseBody = await data.json()
      const plan = cache.getData()
      if (plan) {
        plan.relatedStudents = response
        cache.setData(plan)
      }
    },
  })
}

export default usePostNewRelatedStudents
