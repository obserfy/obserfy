import { PatchObservationRequestBody } from "$api/observations/[observationId]"
import { track } from "$lib/mixpanel"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { patchApi } from "./apiHelpers"

const usePostPlanObservation = (planId: string, observationId: string) => {
  const queryClient = useQueryClient()
  const postPlanObservation = patchApi<PatchObservationRequestBody>(
    `/observations/${observationId}`
  )
  return useMutation(postPlanObservation, {
    onSuccess: async () => {
      track("Observation Updated")
      await queryClient.invalidateQueries(["lesson-plan", planId])
    },
  })
}

export default usePostPlanObservation
