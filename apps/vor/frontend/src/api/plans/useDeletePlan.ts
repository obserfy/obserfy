import {
  MutateFunction,
  MutationResult,
  queryCache,
  useMutation,
} from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeletePlans = (
  planId: string
): [MutateFunction<Response, undefined>, MutationResult<Response>] => {
  const deleteClass = deleteApi(`/plans/${planId}`)

  return useMutation<Response>(deleteClass, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(["plans", getSchoolId()])
    },
  })
}

export default useDeletePlans
