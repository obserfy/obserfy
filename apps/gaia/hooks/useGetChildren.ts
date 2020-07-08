import { useQuery } from "react-query"
import { UserData } from "../pages/api/me"

const useGetChildren = () => {
  return useQuery(
    "children",
    async (): Promise<UserData> => {
      const result = await fetch("/api/me/children")

      if (result.status === 401) {
        const { error } = await result.json()
        throw Error(error)
      }

      return result.json()
    },
    {
      retry: (failureCount, error) =>
        !(error instanceof Error && error.message === "not_authenticated"),
    }
  )
}

export default useGetChildren
