import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import { getPlanCache, setPlanCache } from "./useGetPlan"

const useDeleteRelatedStudent = (planId: string, studentId: string) => {
  const postNewRelatedStudents = deleteApi(
    `/plans/${planId}/students/${studentId}`
  )

  return useMutation(postNewRelatedStudents, {
    onSuccess: () => {
      const plan = getPlanCache(planId)
      if (plan) {
        plan.relatedStudents = plan.relatedStudents.filter(
          ({ id }) => id !== studentId
        )
        setPlanCache(planId, plan)
      }
    },
  })
}

export default useDeleteRelatedStudent
