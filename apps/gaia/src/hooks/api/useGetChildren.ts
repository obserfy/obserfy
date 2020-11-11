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
    onSuccess: async (response) => {
      if (response.length === 0) {
        await router.replace("/no-data")
        return
      }
      const newId = response[0]?.id
      if (!router.query.childId && newId) {
        const path = router.pathname

        const redirectUrl = `${path}?childId=${newId}`
        console.log(redirectUrl)
        await router.replace(redirectUrl)
      }
    },
  })
}

export default useGetChildren
