import {
  MutateFunction,
  MutationResult,
  queryCache,
  useMutation,
} from "react-query"
import { patchApi } from "../fetchApi"

interface UpdateGuardianRequest {
  name?: string
  email?: string
  phone?: string
  note?: string
}

export function usePatchGuardian(
  id: string
): [MutateFunction<Response, unknown>, MutationResult<Response>] {
  const patchGuardian = patchApi<UpdateGuardianRequest>("/guardians", id)

  return useMutation(patchGuardian, {
    onSuccess: async () => {
      await queryCache.invalidateQueries("guardians")
    },
  })
}
