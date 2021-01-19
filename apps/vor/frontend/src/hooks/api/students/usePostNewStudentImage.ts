import { useMutation } from "react-query"
import { BASE_URL } from "../useApi"
import { useGetStudentImagesCache } from "./useGetStudentImages"

const usePostNewStudentImage = (studentId: string) => {
  const cache = useGetStudentImagesCache(studentId)

  const postNewImage = async (image: File) => {
    const body = new FormData()
    body.append("image", image)

    return fetch(`${BASE_URL}/students/${studentId}/images`, {
      credentials: "same-origin",
      method: "POST",
      body,
    })
  }

  return useMutation(postNewImage, {
    onSuccess: async (response) => {
      analytics.track("Student Image Uploaded")

      const responseBody = await response.json()

      const images = cache.getData() ?? []
      images.push(responseBody)
      cache.setData(images)
    },
  })
}

export default usePostNewStudentImage
