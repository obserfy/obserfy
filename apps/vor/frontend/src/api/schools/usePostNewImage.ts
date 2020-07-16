import { useMutation } from "react-query"
import { BASE_URL } from "../useApi"
import { getSchoolId } from "../../hooks/schoolIdState"

const usePostNewImage = () => {
  const postNewImage = async (image: File) => {
    const payload = new FormData()
    payload.append("image", image)

    return fetch(`${BASE_URL}/schools/${getSchoolId()}/images`, {
      credentials: "same-origin",
      method: "POST",
      body: payload,
    })
  }

  return useMutation(postNewImage)
}

export default usePostNewImage
