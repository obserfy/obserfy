import { queryCache, useMutation } from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeletePlans = (planId: string) => {
  const deleteClass = deleteApi(`/plans/${planId}`)

  return useMutation(deleteClass, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(["plans", getSchoolId()])
    },
  })
}

export default useDeletePlans
