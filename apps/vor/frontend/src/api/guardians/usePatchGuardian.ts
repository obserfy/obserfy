import { queryCache, useMutation } from "react-query"
import { patchApi } from "../fetchApi"

interface UpdateGuardianRequest {
  name?: string
  email?: string
  phone?: string
  note?: string
}

export function usePatchGuardian(id: string) {
  const patchGuardian = patchApi<UpdateGuardianRequest>(`/guardians/${id}`)

  return useMutation(patchGuardian, {
    onSuccess: async () => {
      analytics.track("Guardian Updated")
      await queryCache.invalidateQueries("guardians")
    },
  })
}
