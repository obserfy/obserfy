import { useEffect, useState } from "react"
import { navigate } from "../components/Link/Link"

const baseUrl = "/api/v1"

/** @deprecated use the new react-query based hook, create one if it does not exists */
function useOldApiHook<T>(
  url: string,
  fetchOptions?: RequestInit
): [T | undefined, boolean, () => void] {
  // We set isOutdated to true when we know that the data we
  // have from the api is outdated, example would be when we
  // just sent a new data to the server, rendering data that we fetch before
  // outdated.
  const [isOutdated, setIsOutdated] = useState(true)
  const [response, setResponse] = useState<T | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function f(): Promise<void> {
      if (!isOutdated) return
      setLoading(true)
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
      setLoading(false)
    }
    f()
  }, [fetchOptions, isOutdated, url])

  return [response, loading, () => setIsOutdated(true)]
}

export default useOldApiHook
