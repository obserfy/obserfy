import {
  MutateFunction,
  MutationState,
  queryCache,
  useMutation,
} from "react-query"
import { navigate } from "gatsby"
import { ApiError, BASE_URL } from "./useApi"

interface Class {
  name: string
  startTime: Date
  endTime: Date
  weekdays: number[]
}
const usePatchClass = (
  classId: string
): [MutateFunction<Response, Class>, MutationState<Response>] => {
  const fetchApi = async (newClass: Class): Promise<Response> => {
    const result = await fetch(`${BASE_URL}/classes/${classId}`, {
      credentials: "same-origin",
      method: "PATCH",
      body: JSON.stringify(newClass),
    })

    // Throw user to login when something gets 401
    if (result.status === 401) {
      await navigate("/login")
      return result
    }
    if (result.status !== 204) {
      const body: ApiError = await result.json()
      throw Error(body?.error?.message ?? "")
    }

    return result
  }

  return useMutation<Response, Class>(fetchApi, {
    onSuccess: async () => {
      await queryCache.refetchQueries(["class", classId])
    },
  })
}

export default usePatchClass
