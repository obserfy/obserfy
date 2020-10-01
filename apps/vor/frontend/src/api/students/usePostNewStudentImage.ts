import { useMutation, queryCache } from "react-query"
import { BASE_URL } from "../useApi"

const usePostNewStudentImage = (studentId: string) => {
  const postNewImage = async (image: File) => {
    const payload = new FormData()
    payload.append("image", image)

    return fetch(`${BASE_URL}/students/${studentId}/images`, {
      credentials: "same-origin",
      method: "POST",
      body: payload,
    })
  }

  return useMutation(postNewImage, {
    onSuccess: async () => {
      analytics.track("Student Image Uploaded")
      await queryCache.invalidateQueries(["student", studentId, "images"])
    },
  })
}

export default usePostNewStudentImage
