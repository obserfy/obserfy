import { useQuery } from "react-query"
import { UserData } from "$api/me"
import { getApi } from "./apiHelpers"

const useGetUser = () => {
  const getUser = getApi<UserData>("/me")
  return useQuery("me", getUser)
}

export default useGetUser
