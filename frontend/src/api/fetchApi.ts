import { navigate } from "gatsby"

const BASE_URL = "/api/v1"

export const fetchApi = <T>(url: string) => async (): Promise<T> => {
  const result = await fetch(BASE_URL + url, {
    credentials: "same-origin",
  })

  // Throw user to login when something gets 401
  if (result.status === 401) {
    await navigate("/login")
  }

  // Parse json
  return result.json()
}
