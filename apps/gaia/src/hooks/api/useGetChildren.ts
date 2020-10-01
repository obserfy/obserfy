import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { getApi } from "../../apiHelpers"
import { GetChildrenResponse } from "../../pages/api/me/children"

const useGetChildren = () => {
  const router = useRouter()
  const getChildren = getApi<GetChildrenResponse[]>("/me/children")

  return useQuery("children", getChildren, {
    retry: (failureCount, error) =>
      !(error instanceof Error && error.message === "not_authenticated"),
    onSuccess: (response) => {
      const newId = response[0]?.id
      if (!router.query.childId && newId) {
        router.push(`/?childId=${newId}`)
      }
    },
  })
}

export default useGetChildren
