import { useMutation } from "react-query"
import { deleteApi } from "./fetchApi"

const useDeleteImage = (imageId: string) => {
  const deleteImage = deleteApi(`/images/${imageId}`)
  return useMutation(deleteImage)
}

export default useDeleteImage
