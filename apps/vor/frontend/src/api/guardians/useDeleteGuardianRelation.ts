import { queryCache, useMutation } from "react-query"
import { ApiError, BASE_URL } from "../useApi"
import { navigate } from "../../components/Link/Link"

export const useDeleteGuardianRelation = (
  guardianId: string,
  studentId: string
) => {
  const postGuardianRelation = async (): Promise<Response> => {
    const result = await fetch(
      `${BASE_URL}/students/${studentId}/guardianRelations/${guardianId}`,
      {
        credentials: "same-origin",
        method: "DELETE",
      }
    )

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

  return useMutation(postGuardianRelation, {
    onSuccess: () => {
      analytics.track("Guardian Relation Deleted")
      return queryCache.invalidateQueries(["student", studentId])
    },
  })
}
