import { queryCache, useQuery } from "react-query"
import { getApi } from "../apiHelpers"
import { GetChildImagesResponse } from "../pages/api/children/[childId]/images"

interface ChildImages extends GetChildImagesResponse {
  isUploading?: boolean
}
const useGetChildImages = (childId: string) => {
  const getChildImages = getApi<ChildImages[]>(`/children/${childId}/images`)

  return useQuery(["childImages", childId], getChildImages, {
    enabled: childId,
    refetchOnWindowFocus: false,
  })
}

export const getChildImagesCache = (childId: string) => {
  return queryCache.getQueryData<ChildImages[]>(["childImages", childId])
}

export const setChildImagesCache = (
  childId: string,
  update: ChildImages[] | ((old?: ChildImages[]) => ChildImages[])
) => {
  return queryCache.setQueryData<ChildImages[]>(
    ["childImages", childId],
    update
  )
}

export const cancelGetChildImageQuery = (childId: string) => {
  return queryCache.cancelQueries(["childImages", childId])
}

export default useGetChildImages
