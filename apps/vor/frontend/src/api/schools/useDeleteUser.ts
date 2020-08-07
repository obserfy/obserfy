import {
  MutateFunction,
  MutationResult,
  queryCache,
  useMutation,
} from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeleteUser = (
  userId: string
): [MutateFunction<Response, undefined>, MutationResult<Response>] => {
  const deleteUser = deleteApi(`/schools/${getSchoolId()}/users/${userId}`)
  return useMutation<Response>(deleteUser, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(["school"])
    },
  })
}

export default useDeleteUser
