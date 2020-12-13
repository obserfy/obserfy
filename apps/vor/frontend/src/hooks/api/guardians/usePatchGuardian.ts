import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { updateGuardianCache } from "./useGetGuardian"

interface UpdateGuardianRequest {
  name?: string
  email?: string
  phone?: string
  note?: string
  address?: string
}

export function usePatchGuardian(id: string) {
  const patchGuardian = patchApi<UpdateGuardianRequest>(`/guardians/${id}`)

  return useMutation(patchGuardian, {
    onSuccess: async (response) => {
      analytics.track("Guardian Updated")
      if (response === undefined) return
      const body = await response.json()
      updateGuardianCache(body)
    },
  })
}
