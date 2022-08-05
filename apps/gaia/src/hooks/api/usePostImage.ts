import { useMutation } from "@tanstack/react-query"
import dayjs from "$lib/dayjs"
import { postFile } from "./apiHelpers"
import { useChildImagesCache } from "./useGetChildImages"

const usePostImage = (childId: string, schoolId: string) => {
  const childImagesCache = useChildImagesCache(childId)
  const postImage = async (image: { id: string; file: File }) => {
    return postFile(
      `/image?schoolId=${schoolId}&childId=${childId}&imageId=${image.id}`
    )(image)
  }

  return useMutation(postImage, {
    onSettled: async () => {
      await childImagesCache.invalidate()
    },
  })
}

export default usePostImage
