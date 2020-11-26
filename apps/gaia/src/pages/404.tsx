import React, { useEffect } from "react"
import Error from "next/error"

export default function NotFound() {
  useEffect(() => {
    mixpanel.track("404 visited")
  }, [])

  // Opinionated: do not record an exception in Sentry for 404
  return <Error statusCode={404} />
}
