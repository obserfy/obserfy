import { useMutation } from "react-query"
import dayjs from "../../utils/dayjs"
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
    onMutate: async (variables) => {
      await childImagesCache.cancelQueries()
      const old = childImagesCache.getData() ?? []

      childImagesCache.setData([
        {
          id: variables.id,
          imageUrl: URL.createObjectURL(variables.file),
          originalImageUrl: URL.createObjectURL(variables.file),
          isUploading: true,
          createdAt: dayjs().toString(),
        },
        ...old,
      ])

      return { previousImages: old }
    },
    onError: (err, variables, context: any) => {
      childImagesCache.setData(context.previousImages)
    },
    onSettled: () => childImagesCache.invalidate(),
  })
}

export default usePostImage
