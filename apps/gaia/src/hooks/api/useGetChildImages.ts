import { useQuery, useQueryClient } from "react-query"
import { getApi } from "./apiHelpers"
import { GetChildImagesResponse } from "../../pages/api/children/[childId]/images"

export interface ChildImage extends GetChildImagesResponse {
  isUploading?: boolean
}
const useGetChildImages = (childId: string = "") => {
  const getChildImages = getApi<ChildImage[]>(`/children/${childId}/images`)

  return useQuery(["child", childId, "images"], getChildImages, {
    enabled: childId !== "",
    refetchOnWindowFocus: false,
  })
}

export const useChildImagesCache = (childId: string) => {
  const client = useQueryClient()
  const key = ["child", childId, "images"]

  return {
    getData: () => client.getQueryData<ChildImage[]>(key),
    setData: (data: ChildImage[]) =>
      client.setQueryData<ChildImage[]>(key, data),
    cancelQueries: () => client.cancelQueries(key),
    invalidate: () => client.invalidateQueries(key),
  }
}

export default useGetChildImages
