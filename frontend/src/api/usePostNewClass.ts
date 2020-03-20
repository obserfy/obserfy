import { MutateFunction, MutationState, useMutation } from "react-query"
import { navigate } from "gatsby"
import { ApiError, BASE_URL } from "./useApi"
import { getSchoolId } from "../hooks/schoolIdState"
import Class from "../pages/dashboard/settings/class"

interface Class {
  name: string
  startTime: Date
  endTime: Date
  weekdays: number[]
}
const usePostNewClass = (): [
  MutateFunction<Response, Class>,
  MutationState<Response>
] => {
  const schoolId = getSchoolId()
  const fetchApi = async (newClass: Class): Promise<Response> => {
    const result = await fetch(`${BASE_URL}/schools/${schoolId}/class`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(newClass),
    })

    // Throw user to login when something gets 401
    if (result.status === 401) {
      await navigate("/login")
      return result
    }
    if (result.status !== 201) {
      const body: ApiError = await result.json()
      throw Error(body?.error?.message ?? "")
    }

    return result
  }

  return useMutation<Response, Class>(fetchApi)
}

export default usePostNewClass
