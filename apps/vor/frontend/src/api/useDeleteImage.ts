import { queryCache, useMutation } from "react-query"
import { deleteApi } from "./fetchApi"

const useDeleteImage = (studentId: string, imageId: string) => {
  const deleteImage = deleteApi(`/images/${imageId}`)
  return useMutation(deleteImage, {
    onSuccess: async () => {
      await Promise.all([
        await queryCache.invalidateQueries(["student", studentId, "images"]),
        await queryCache.invalidateQueries(["observation"]),
        await queryCache.invalidateQueries([
          "student",
          studentId,
          "observations",
        ]),
      ])
    },
  })
}

export default useDeleteImage
