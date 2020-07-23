import { navigate } from "gatsby"
import { useMutation } from "react-query"

interface PostSignUpRequestBody {
  name: string
  email: string
  password: string
  inviteCode?: string
}
const usePostRegister = () => {
  const postSignUp = async (payload: PostSignUpRequestBody) => {
    analytics.track("User Register")
    const body = new FormData()
    body.append("email", payload.email)
    body.append("password", payload.password)
    body.append("name", payload.name)
    body.append("inviteCode", payload.inviteCode ?? "")
    const response = await fetch("/auth/register", {
      method: "POST",
      credentials: "same-origin",
      body,
    })

    if (response.ok) {
      analytics.track("User Register Success")
      await navigate("/choose-school")
    } else if (response.status === 409) {
      analytics.track("User Register Failed", {
        email: payload.email,
        status: response.status,
      })
      throw new Error("Email has already been used to register")
    }
  }

  return useMutation(postSignUp)
}

export default usePostRegister
