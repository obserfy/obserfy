import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { UserData } from "../../pages/api/me"
import { getApi } from "../../apiHelpers"

const useGetUser = () => {
  const router = useRouter()
  const getUser = getApi<UserData>("/me")
  return useQuery("me", getUser, {
    retry: (failureCount, error) => !(error.message === "not_authenticated"),
    onError: (error) => {
      if (error?.message === "not_authenticated") {
        router.push(`/session-expired`)
      }
    },
  })
}

export default useGetUser
