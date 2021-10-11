import Script from "next/script"
import { setUser } from "$lib/sentry"

const LoadSentry = () => {
  if (process.env.NODE_ENV !== "production") return <></>

  return (
    <Script
      id="load-sentry"
      strategy="beforeInteractive"
      src="https://js.sentry-cdn.com/93f37b2e17184c7f8d778082aa6155ab.min.js"
      onLoad={async () => {
        const me = await fetch("/api/me")
        const data = await me.json()
        setUser(data)
      }}
    />
  )
}

export default LoadSentry
