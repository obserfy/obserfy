// import mixpanel from "mixpanel-lite"
import { redirectToPreferredLang } from "./src/i18n"
import { detectMobile, loadChatwoot } from "./src/chatwoot"
import { track } from "./src/analytics"

export const onServiceWorkerUpdateReady = () => {
  if (window.updateAvailable) {
    window.updateAvailable()
  }
}

export const onRouteUpdate = ({location}) => {
  track("Loaded a page", {
    title: document.title,
    location: location.pathname
  })

  if (typeof Sentry !== "undefined") {
    const breadcrumb = {
      category: "page",
      level: "info",
      data: {
        title: document.title,
        location: location.pathname
      },
    }
    Sentry.addBreadcrumb(breadcrumb)
  }
}

// For redirecting user to preferred language
export const wrapPageElement = (params) => {
  redirectToPreferredLang(
    params.props.location,
    params.props.pageContext.originalPath
  )

  return params.element
}

export const onClientEntry = () => {
  if (typeof window !== "undefined" && window.mixpanel !== undefined) {
    mixpanel.init("470951a0c3bd38f4c305063090790dcb")
  }
}

// Add chatwoot
export const onInitialClientRender = () => {
  const hasTouchScreen = detectMobile()
  if (!hasTouchScreen) {
    loadChatwoot()
  }
}
