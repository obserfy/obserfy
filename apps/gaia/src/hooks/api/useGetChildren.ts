import { useQuery } from "react-query"
import { getApi } from "../../apiHelpers"

interface GetChildrenResponse {
  id: string
  name: string
}
const useGetChildren = () => {
  const getChildren = getApi<GetChildrenResponse[]>("/me/children")
  return useQuery("children", getChildren, {
    retry: (failureCount, error) =>
      !(error instanceof Error && error.message === "not_authenticated"),
  })
}

export default useGetChildren
