import { useQuery } from "@tanstack/react-query"
import { GetChildrenResponse } from "../../app/api/me/children/route"
import { getApi } from "./apiHelpers"

const useGetChildren = () => {
  const getChildren = getApi<GetChildrenResponse[]>("/me/children")

  return useQuery(["children"], getChildren)
}

export default useGetChildren
