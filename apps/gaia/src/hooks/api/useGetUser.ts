import { useQuery } from "react-query"
import { UserData } from "../../pages/api/me"
import { getApi } from "../../apiHelpers"

const useGetUser = () => {
  const getUser = getApi<UserData>("/me")
  return useQuery("me", getUser, {
    retry: (failureCount, error) =>
      !(error instanceof Error && error.message === "not_authenticated"),
  })
}

export default useGetUser
