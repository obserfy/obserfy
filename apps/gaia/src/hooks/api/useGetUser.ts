import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { UserData } from "../../pages/api/me"
import { getApi } from "../../apiHelpers"

const useGetUser = () => {
  const router = useRouter()
  const getUser = getApi<UserData>("/me")
  return useQuery("me", getUser, {
    retry: (failureCount, error) =>
      // TODO: Don't use any
      !((error as any).message === "not_authenticated"),
    onError: (error) => {
      if ((error as any)?.message === "not_authenticated") {
        router.push(`/session-expired`)
      }
    },
    onSuccess: (data) => {
      mixpanel.identify(data.sub)
      mixpanel.people.set({
        name: data.name,
        email: data.email,
        avatar: data.picture,
        children: data.children.map(({ name }) => name),
        schools: data.children.map(({ schoolName }) => schoolName),
      })
    },
  })
}

export default useGetUser
