import { useQuery } from "react-query"

const useGetChildImages = (childId: string) => {
  const getChildImages = async () => {
    const result = await fetch(`/api/children/${childId}/images`)
    return result.json()
  }
  return useQuery(["childImages", childId], getChildImages, {
    enabled: childId,
  })
}

export default useGetChildImages
