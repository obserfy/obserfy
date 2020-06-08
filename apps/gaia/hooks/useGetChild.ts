import { useQuery } from "react-query"

const useGetChild = (childId: string) => {
  const getChild = async () => {
    const result = await fetch(`/api/child/${childId}`)
    return result.json()
  }
  return useQuery(childId && ["child", childId], getChild)
}

export default useGetChild
