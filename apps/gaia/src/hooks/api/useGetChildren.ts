import { GetChildrenResponse } from "$api/me/children"
import { useQuery } from "react-query"
import { getApi } from "./apiHelpers"

const useGetChildren = () => {
  const getChildren = getApi<GetChildrenResponse[]>("/me/children")

  return useQuery("children", getChildren)
}

export default useGetChildren
