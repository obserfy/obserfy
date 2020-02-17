import { useEffect, useState } from "react"
import { navigate } from "gatsby"

export const BASE_URL = "/api/v1"

export interface Error {
  error?: {
    message: string
  }
}

export interface Api<T> extends Error {
  loading: boolean
  setOutdated: () => void
  data?: T
}

function useApi<T>(url: string, fetchOptions?: RequestInit): Api<T> {
  const [isOutdated, setIsOutdated] = useState(true)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState<T & Error>()

  useEffect(() => {
    async function f(): Promise<void> {
      if (!isOutdated) return
      setLoading(true)
      const result = await fetch(`${BASE_URL}${url}`, {
        credentials: "same-origin",
        ...fetchOptions,
      })

      // Throw user to login when something gets 401
      if (result.status === 401) {
        await navigate("/login")
        return
      }

      // Parse json
      const data = await result.json()
      setResponse(data)

      // Reset the state
      setIsOutdated(false)
      setLoading(false)
    }
    f()
  }, [fetchOptions, isOutdated, url])

  return {
    loading,
    data: response,
    error: response?.error,
    setOutdated: () => setIsOutdated(true),
  }
}

export default useApi
