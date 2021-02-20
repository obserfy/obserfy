import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { BASE_URL } from "../useApi"
import { useGetStudentImagesCache } from "./useGetStudentImages"

const usePostNewStudentImage = (studentId: string) => {
  const cache = useGetStudentImagesCache(studentId)

  const postNewImage = async (image: File) => {
    const body = new FormData()
    body.append("image", image)

    const result = await fetch(`${BASE_URL}/students/${studentId}/images`, {
      credentials: "same-origin",
      method: "POST",
      body,
    })

    const json = await result.json()
    return json
  }

  return useMutation(postNewImage, {
    onSuccess: async (response) => {
      track("Student Image Uploaded")

      const images = cache.getData() ?? []
      images.push(response)
      cache.setData(images)

      await cache.refetchQueries()
    },
  })
}

export default usePostNewStudentImage
