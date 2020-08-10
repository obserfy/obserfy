import { queryCache, useMutation } from "react-query"
import { deleteApi } from "./fetchApi"

const useDeleteImage = (studentId: string, imageId: string) => {
  const deleteImage = deleteApi(`/images/${imageId}`)
  return useMutation(deleteImage, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(["student", studentId, "images"])
    },
  })
}

export default useDeleteImage
