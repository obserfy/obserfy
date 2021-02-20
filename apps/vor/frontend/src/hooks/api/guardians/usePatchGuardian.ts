import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { patchApi } from "../fetchApi"
import { useGetGuardianCache } from "./useGetGuardian"

interface UpdateGuardianRequest {
  name?: string
  email?: string
  phone?: string
  note?: string
  address?: string
}

export function usePatchGuardian(id: string) {
  const cache = useGetGuardianCache(id)
  const patchGuardian = patchApi<UpdateGuardianRequest>(`/guardians/${id}`)

  return useMutation(patchGuardian, {
    onSuccess: async (response) => {
      track("Guardian Updated")
      if (response === undefined) return
      const body = await response.json()
      cache.setData(body)
    },
  })
}
