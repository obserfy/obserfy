import { useMutation, useQueryClient } from "react-query"
import { track } from "../../analytics"
import { deleteApi } from "./fetchApi"

const useDeleteImage = (studentId: string, imageId: string) => {
  const queryClient = useQueryClient()
  const deleteImage = deleteApi(`/images/${imageId}`)
  return useMutation(deleteImage, {
    onSuccess: async () => {
      track("Image Deleted")
      await Promise.all([
        await queryClient.invalidateQueries(["student", studentId, "images"]),
        await queryClient.invalidateQueries(["observation"]),
        await queryClient.invalidateQueries([
          "student",
          studentId,
          "observations",
        ]),
      ])
    },
  })
}

export default useDeleteImage
