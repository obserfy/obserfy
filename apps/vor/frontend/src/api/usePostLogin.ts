import { useMutation } from "react-query"
import { navigate } from "gatsby"
import { ApiError } from "./useApi"

interface PostLoginRequestBody {
  email: string
  password: string
}
const usePostLogin = () => {
  const postLogin = async (payload: PostLoginRequestBody) => {
    const result = await fetch(`/auth/login`, {
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify(payload),
    })

    if (result.ok) {
      analytics.track("User Login Success")
      await navigate("/choose-school")
    } else {
      const body: ApiError = await result.json()
      analytics.track("User Login Failed", {
        email: payload.email,
        status: result.status,
      })
      throw Error(body?.error?.message ?? "")
    }

    return result
  }
  return useMutation(postLogin)
}

export default usePostLogin
