import { queryCache, useMutation } from "react-query"
import { postFile } from "../../apiHelpers"
import {
  cancelGetChildImageQuery,
  getChildImagesCache,
  setChildImagesCache,
} from "../useGetChildImages"

const usePostImage = (childId: string, schoolId: string) => {
  const postImage = async (image: { id: string; file: File }) => {
    return postFile(
      `/image?schoolId=${schoolId}&childId=${childId}&imageId=${image.id}`
    )(image)
  }
  return useMutation(postImage, {
    onMutate: async (variables) => {
      cancelGetChildImageQuery(childId)
      const old = getChildImagesCache(childId) ?? []

      setChildImagesCache(childId, () => [
        {
          id: variables.id,
          imageUrl: URL.createObjectURL(variables.file),
          isUploading: true,
        },
        ...old,
      ])

      return () => setChildImagesCache(childId, old)
    },
    onError: (err, variables, rollback: () => void) => rollback(),
    onSettled: () => queryCache.invalidateQueries(["childImages", childId]),
  })
}

export default usePostImage
