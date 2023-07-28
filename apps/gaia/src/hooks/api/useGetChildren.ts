import { useQuery } from "@tanstack/react-query"
import { GetChildrenResponse } from "../../app/api/user/students/route"
import { getApi } from "./apiHelpers"

const useGetChildren = () => {
  const getChildren = getApi<GetChildrenResponse[]>("/user/students")

  return useQuery(["children"], getChildren)
}

export default useGetChildren
