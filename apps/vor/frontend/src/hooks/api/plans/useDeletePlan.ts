import { useMutation, useQueryClient } from "react-query"
import { getSchoolId } from "../../schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeletePlan = (planId: string) => {
  const queryCache = useQueryClient()
  const deleteClass = deleteApi(`/plans/${planId}`)

  return useMutation(deleteClass, {
    onSuccess: async () => {
      analytics.track("Plan Deleted")
      await queryCache.invalidateQueries(["plans", getSchoolId()])
    },
  })
}

export default useDeletePlan
