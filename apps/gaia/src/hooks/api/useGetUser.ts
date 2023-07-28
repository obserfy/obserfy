import { useQuery } from "@tanstack/react-query"
import { UserData } from "../../app/api/user/route"
import { getApi } from "./apiHelpers"

const useGetUser = () => {
  const getUser = getApi<UserData>("/user")
  return useQuery(["me"], getUser)
}

export default useGetUser
