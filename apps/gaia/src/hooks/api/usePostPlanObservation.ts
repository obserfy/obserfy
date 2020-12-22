import { useMutation, useQueryClient } from "react-query"
import { PostPlanObservationRequest } from "../../pages/api/plans/[planId]/observations"
import { postApi } from "./apiHelpers"

const usePostPlanObservation = (planId: string) => {
  const queryClient = useQueryClient()
  const postPlanObservation = postApi<PostPlanObservationRequest>(
    `/plans/${planId}/observations`
  )
  return useMutation(postPlanObservation, {
    onSuccess: async () => {
      mixpanel.track("Observation Created")
      await queryClient.invalidateQueries(["childPlans"])
    },
  })
}

export default usePostPlanObservation
