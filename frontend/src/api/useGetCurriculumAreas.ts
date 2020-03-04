import { navigate } from "gatsby"
import { QueryResult, useQuery } from "react-query"
import { getSchoolId } from "../hooks/schoolIdState"
import { Area } from "./useGetArea"
import { BASE_URL } from "./useApi"

export function useGetCurriculumAreas(): QueryResult<Area[], {}> {
  async function fetchCurriculumAreas(): Promise<Area[]> {
    const result = await fetch(
      `${BASE_URL}/schools/${getSchoolId()}/curriculum/areas`,
      {
        credentials: "same-origin",
      }
    )

    // Throw user to login when something gets 401
    if (result.status === 401) {
      await navigate("/login")
      return []
    }

    // Parse json
    return result.json()
  }
  return useQuery<Area[], {}>("areas", fetchCurriculumAreas, {
    // This data is pretty stable, no need to keep re-fetching
    refetchOnWindowFocus: false,
  })
}
