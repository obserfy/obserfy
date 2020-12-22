import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import { useGetPlanCache } from "./useGetPlan"

const useDeleteRelatedStudent = (planId: string, studentId: string) => {
  const cache = useGetPlanCache(planId)
  const postNewRelatedStudents = deleteApi(
    `/plans/${planId}/students/${studentId}`
  )

  return useMutation(postNewRelatedStudents, {
    onSuccess: () => {
      const plan = cache.getData()

      if (plan) {
        plan.relatedStudents = plan.relatedStudents.filter(
          ({ id }) => id !== studentId
        )
        cache.setData(plan)
      }
    },
  })
}

export default useDeleteRelatedStudent
