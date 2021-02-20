import { useMutation, useQueryClient } from "react-query"
import { track } from "../../../analytics"
import { ApiError, BASE_URL } from "../useApi"
import { getSchoolId } from "../../schoolIdState"
import { navigate } from "../../../components/Link/Link"

interface Class {
  name: string
  startTime: Date
  endTime: Date
  weekdays: number[]
}
const usePostNewClass = () => {
  const queryCache = useQueryClient()
  const schoolId = getSchoolId()
  const fetchApi = async (newClass: Class): Promise<Response> => {
    const result = await fetch(`${BASE_URL}/schools/${schoolId}/classes`, {
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

  return useMutation(fetchApi, {
    onSuccess: async () => {
      track("Class Created")
      await queryCache.invalidateQueries(["classes", schoolId])
    },
  })
}

export default usePostNewClass
