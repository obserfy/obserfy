import { GetChildImagesResponse } from "$api/children/[childId]/images"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getApi } from "./apiHelpers"

const useGetChildImages = (
  childId: string = "",
  imagesByMonth: GetChildImagesResponse
) => {
  const getChildImages = getApi<GetChildImagesResponse>(
    `/children/${childId}/images`
  )

  return useQuery(["child", childId, "images"], getChildImages, {
    enabled: childId !== "",
    initialData: imagesByMonth,
  })
}

export const useChildImagesCache = (childId: string) => {
  const client = useQueryClient()
  const key = ["child", childId, "images"]

  return {
    getData: () => client.getQueryData<GetChildImagesResponse>(key),
    setData: (data: GetChildImagesResponse) =>
      client.setQueryData<GetChildImagesResponse>(key, data),
    cancelQueries: () => client.cancelQueries(key),
    invalidate: () => client.invalidateQueries(key),
  }
}

export default useGetChildImages
