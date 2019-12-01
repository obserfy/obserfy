import { useEffect, useState } from "react"
import { navigate } from "gatsby"

const baseUrl = "/api/v1"

function useApi<T>(url: string, fetchOptions?: RequestInit): T | undefined {
  const [response, setResponse] = useState<T | undefined>()

  useEffect(() => {
    async function f(): Promise<void> {
      const result = await fetch(`${baseUrl}${url}`, {
        credentials: "same-origin",
        ...fetchOptions,
      })
      if (result.status === 401) {
        // throw new UnauthorizedError()
        navigate("/login")
      }
      const data = await result.json()
      setResponse(data)
    }
    f()
  }, [fetchOptions, url])

  return response
}

export default useApi
