import { useQuery } from "react-query"
import { getApi } from "../apiHelpers"
import { GetChildImagesResponse } from "../pages/api/children/[childId]/images"

const useGetChildImages = (childId: string) => {
  const getChildImages = getApi<GetChildImagesResponse[]>(
    `/children/${childId}/images`
  )

  return useQuery(["childImages", childId], getChildImages, {
    enabled: childId,
  })
}

export default useGetChildImages
