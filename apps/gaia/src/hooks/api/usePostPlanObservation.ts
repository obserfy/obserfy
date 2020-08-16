import { queryCache, useMutation } from "react-query"
import { postApi } from "../../apiHelpers"
import { PostPlanObservationRequest } from "../../pages/api/plans/[planId]/observations"

const usePostPlanObservation = (planId: string) => {
  const postPlanObservation = postApi<PostPlanObservationRequest>(
    `/plans/${planId}/observations`
  )
  return useMutation(postPlanObservation, {
    onSuccess: async () => queryCache.invalidateQueries(["childPlans"]),
  })
}

export default usePostPlanObservation
