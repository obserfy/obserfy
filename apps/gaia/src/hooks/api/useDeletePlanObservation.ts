import { track } from "$lib/mixpanel"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteApi } from "./apiHelpers"

const usePostPlanObservation = (planId: string, observationId: string) => {
  const queryClient = useQueryClient()
  const postPlanObservation = deleteApi(`/observations/${observationId}`)
  return useMutation(postPlanObservation, {
    onSuccess: async () => {
      track("Observation Deleted")
      await queryClient.invalidateQueries(["lesson-plan", planId])
    },
  })
}

export default usePostPlanObservation
