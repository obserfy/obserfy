import { queryCache, useMutation } from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeletePlan = (planId: string) => {
  const deleteClass = deleteApi(`/plans/${planId}`)

  return useMutation(deleteClass, {
    onSuccess: async () => {
      analytics.track("Plan Deleted")
      await queryCache.invalidateQueries(["plans", getSchoolId()])
    },
  })
}

export default useDeletePlan
