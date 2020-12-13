import { useMutation } from "react-query"
import { postApi } from "../fetchApi"
import { getPlanCache, setPlanCache } from "./useGetPlan"

type PostNewRelatedStudentsResponseBody = Array<{
  id: string
  name: string
  profileImageUrl: string
}>
interface PostNewRelatedStudentsRequestBody {
  studentIds: string[]
}
const usePostNewRelatedStudents = (planId: string) => {
  const postNewRelatedStudents = postApi<PostNewRelatedStudentsRequestBody>(
    `/plans/${planId}/students`
  )

  return useMutation(postNewRelatedStudents, {
    onSuccess: async (data) => {
      if (!data) return
      const response: PostNewRelatedStudentsResponseBody = await data.json()
      const plan = getPlanCache(planId)
      if (plan) {
        plan.relatedStudents = response
        setPlanCache(planId, plan)
      }
    },
  })
}

export default usePostNewRelatedStudents
