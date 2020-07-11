import { useQuery } from "react-query"

const useGetChild = (childId: string) => {
  const getChild = async () => {
    const result = await fetch(`/api/children/${childId}`)
    return result.json()
  }
  return useQuery(["child", childId], getChild, {
    enabled: childId,
  })
}

export default useGetChild
