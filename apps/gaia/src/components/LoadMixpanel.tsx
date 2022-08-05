import { useRouter } from "next/router"
import Script from "next/script"

const LoadMixpanel = () => {
  const router = useRouter()

  if (process.env.NODE_ENV !== "production") return <></>

  return (
    <Script
      src="/mixpanel-lite.min.js"
      onLoad={async () => {
        mixpanel.init("bb93616fa99d71364cdee8cae08d4644")

        const me = await fetch("/api/me")
        const data = await me.json()

        mixpanel.identify(data.sub)
        mixpanel.people.set({
          name: data.name,
          email: data.email,
          $avatar: data.picture,
          children: data.children.map(({ name }: any) => name),
          schools: data.children.map(({ schoolname }: any) => schoolname),
        })
        router.events.on("routeChangeComplete", (url: string) => {
          mixpanel.track("Loaded a Page", { url })
        })
      }}
    />
  )
}

export default LoadMixpanel
