import {
  MutateFunction,
  MutationResult,
  queryCache,
  useMutation,
} from "react-query"
import { navigate } from "gatsby"
import { ApiError, BASE_URL } from "./useApi"
import { getSchoolId } from "../hooks/schoolIdState"

const useDeleteClass = (
  classId: string
): [MutateFunction<Response, undefined>, MutationResult<Response>] => {
  const fetchApi = async (): Promise<Response> => {
    const result = await fetch(`${BASE_URL}/classes/${classId}`, {
      credentials: "same-origin",
      method: "DELETE",
    })

    // Throw user to login when something gets 401
    if (result.status === 401) {
      await navigate("/login")
      return result
    }
    if (result.status !== 200) {
      const body: ApiError = await result.json()
      throw Error(body?.error?.message ?? "")
    }

    return result
  }

  return useMutation<Response>(fetchApi, {
    onSuccess: async () => {
      await queryCache.refetchQueries(["classes", getSchoolId()])
    },
  })
}

export default useDeleteClass
