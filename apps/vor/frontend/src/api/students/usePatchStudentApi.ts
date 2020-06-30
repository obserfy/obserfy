import {
  MutateFunction,
  MutationResult,
  queryCache,
  useMutation,
} from "react-query"
import { patchApi } from "../fetchApi"

interface UpdateStudentRequestBody {
  name?: string
  customId?: string
  dateOfBirth?: string
  dateOfEntry?: string
  gender?: number
  active?: boolean
}
export function usePatchStudentApi(
  id: string
): [MutateFunction<Response, unknown>, MutationResult<Response>] {
  const patchStudent = patchApi<UpdateStudentRequestBody>("/students", id)

  return useMutation(patchStudent, {
    onSuccess: async () => {
      await Promise.all([
        queryCache.refetchQueries(["student", id]),
        queryCache.refetchQueries("students"),
      ])
    },
  })
}
