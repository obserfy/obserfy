import { useRouter } from "next/router"
import { useEffect } from "react"

const useInitAnalytics = () => {
  const router = useRouter()

  useEffect(() => {
    // Setup analytics
    mixpanel.init("bb93616fa99d71364cdee8cae08d4644")
    const pageRoutingAnalytics = (url: string) => {
      mixpanel.track("Loaded a Page", { url })
    }
    router.events.on("routeChangeComplete", pageRoutingAnalytics)

    return () => {
      router.events.off("routeChangeComplete", pageRoutingAnalytics)
    }
  }, [])
}

export default useInitAnalytics
