import Error from "next/error"
import { useEffect } from "react"

export default function NotFound() {
  useEffect(() => {
    if (mixpanel.track) {
      mixpanel.track("404 visited")
    }
  }, [])

  // Opinionated: do not record an exception in Sentry for 404
  return <Error statusCode={404} />
}
