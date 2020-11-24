import { queryCache, useQuery } from "react-query"
import { getApi } from "./apiHelpers"
import { GetChildImagesResponse } from "../../pages/api/children/[childId]/images"

export interface ChildImage extends GetChildImagesResponse {
  isUploading?: boolean
}
const useGetChildImages = (childId: string) => {
  const getChildImages = getApi<ChildImage[]>(`/children/${childId}/images`)

  return useQuery(["childImages", childId], getChildImages, {
    enabled: childId,
    refetchOnWindowFocus: false,
  })
}

export const getChildImagesCache = (childId: string) => {
  return queryCache.getQueryData<ChildImage[]>(["childImages", childId])
}

export const setChildImagesCache = (
  childId: string,
  update: ChildImage[] | ((old?: ChildImage[]) => ChildImage[])
) => {
  return queryCache.setQueryData<ChildImage[]>(["childImages", childId], update)
}

export const cancelGetChildImageQuery = (childId: string) => {
  return queryCache.cancelQueries(["childImages", childId])
}

export default useGetChildImages
