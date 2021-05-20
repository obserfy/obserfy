import { useQuery } from "react-query"
import * as Sentry from "@sentry/node"
import { UserData } from "../../pages/api/me"
import { getApi } from "./apiHelpers"

const useGetUser = () => {
  const getUser = getApi<UserData>("/me")
  return useQuery("me", getUser, {
    onSuccess: (data) => {
      Sentry.setUser({
        id: data.sub,
        email: data.email,
        username: data.name,
      })
      mixpanel.identify(data.sub)
      mixpanel.people.set({
        Name: data.name,
        Email: data.email,
        $avatar: data.picture,
        children: data.children.map(({ name }) => name),
        schools: data.children.map(({ schoolName }) => schoolName),
      })
    },
  })
}

export default useGetUser
