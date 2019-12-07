import { useEffect, useState } from "react"
import { navigate } from "gatsby"

const baseUrl = "/api/v1"

function useApi<T>(
  url: string,
  fetchOptions?: RequestInit
): [T | undefined, () => void] {
  // We set isOutdated to true when we know that the data we
  // have from the api is outdated, example would be when we
  // just sent a new data to the server, rendering data that we fetch before
  // outdated.
  const [isOutdated, setIsOutdated] = useState(true)
  const [response, setResponse] = useState<T | undefined>()

  useEffect(() => {
    async function f(): Promise<void> {
      if (!isOutdated) return
      const result = await fetch(`${baseUrl}${url}`, {
        credentials: "same-origin",
        ...fetchOptions,
      })
      if (result.status === 401) {
        // throw new UnauthorizedError()
        navigate("/login")
        return
      }
      const data = await result.json()
      setIsOutdated(false)
      setResponse(data)
    }
    f()
  }, [fetchOptions, isOutdated, url])

  return [response, () => setIsOutdated(true)]
}

export default useApi
