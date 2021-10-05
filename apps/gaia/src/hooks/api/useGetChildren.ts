import { useQuery } from "react-query"
import { GetChildrenResponse } from "$api/me/children"
import { getApi } from "./apiHelpers"

const useGetChildren = () => {
  const getChildren = getApi<GetChildrenResponse[]>("/me/children")

  return useQuery("children", getChildren)
}

export default useGetChildren
