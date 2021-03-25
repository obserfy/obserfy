import { useMutation } from "react-query"
import { navigate } from "../../components/Link/Link"

const useLogout = () => {
  const logout = async () => {
    return fetch("/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    })
  }

  return useMutation(logout, {
    onSuccess: () => {
      // @ts-ignore
      if (window.$chatwoot) {
        // @ts-ignore
        window.$chatwoot.reset()
      }
      navigate("/login")
    },
  })
}

export default useLogout
