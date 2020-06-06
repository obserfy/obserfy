import {
  MutateFunction,
  MutationResult,
  queryCache,
  useMutation,
} from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeleteClass = (
  classId: string
): [MutateFunction<Response, undefined>, MutationResult<Response>] => {
  const deleteClass = deleteApi("/classes", classId)

  return useMutation<Response>(deleteClass, {
    onSuccess: async () => {
      await queryCache.refetchQueries(["classes", getSchoolId()])
    },
  })
}

export default useDeleteClass
