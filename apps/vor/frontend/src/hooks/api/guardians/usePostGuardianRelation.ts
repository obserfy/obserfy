import { useMutation, useQueryClient } from "react-query"
import { track } from "../../../analytics"
import { navigate } from "../../../components/Link/Link"
import { ApiError, BASE_URL } from "../useApi"

export const usePostGuardianRelation = (
  guardian: { id: string },
  studentId: string
) => {
  const queryCache = useQueryClient()
  const postGuardianRelation = async (
    relationship: number
  ): Promise<Response> => {
    const result = await fetch(
      `${BASE_URL}/students/${studentId}/guardianRelations`,
      {
        credentials: "same-origin",
        method: "POST",
        body: JSON.stringify({
          id: guardian.id,
          relationship,
        }),
      }
    )

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

  return useMutation(postGuardianRelation, {
    onSuccess: async () => {
      track("Guardian Relation Created")
      await queryCache.invalidateQueries(["student", studentId])
    },
  })
}
