import browserLang from "browser-lang"
import "./src/global.css"
import { navigate, withPrefix } from "gatsby"
import { getApi } from "./src/hooks/api/fetchApi"
import { getSchoolId } from "./src/hooks/schoolIdState"
import { GetSchoolResponse } from "./src/hooks/api/schools/useGetSchool"

// Disabled because it currently breaks due to gatsby's changes.
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
// export const shouldUpdateScroll = ({
//   prevRouterProps: { location },
//   routerProps,
//   getSavedScrollPosition,
// }) => {
//   // =============== What is all of this??? ==============================
//   // This is a simple hack to preserve scroll position for some navigation links
//   // (such as link for going back and bottom navigation link).
//
//   // Get scroll position of the current page the user in
//   const lastPosition = getSavedScrollPosition(location)
//   // undocumented internals.
//   window.sessionStorage.setItem(
//     `@@scroll|${location.pathname}`,
//     JSON.stringify(lastPosition)
//   )
//   console.log(`@@scroll|${location.pathname}`)
//
//   // If state.preserveScroll is true, we'll use the last known
//   // scroll position of the given pathname, and scroll to it.
//   if (routerProps.location.state?.preserveScroll) {
//     const currentPosition = window.sessionStorage.getItem(
//       `@@scroll|${routerProps.location.pathname}`
//     )
//     const position = JSON.parse(currentPosition)
//     window.scrollTo(...(position || [0, 0]))
//
//     console.log(currentPosition)
//     console.log(routerProps.location.pathname)
//     return false
//   }
//
//   return true
// }

export const onServiceWorkerUpdateReady = () => {
  if (window.updateAvailable) {
    window.updateAvailable()
  }
}

export const onClientEntry = () => {
  window.analytics.on("page", function (event, properties, options) {
    const breadcrumb = {
      category: "page",
      level: "info",
      data: options,
    }
    window.Sentry.addBreadcrumb(breadcrumb)
  })

  window.analytics.on("track", function (event, properties, options) {
    const breadcrumb = {
      category: "track",
      level: "info",
      data: properties,
    }
    window.Sentry.addBreadcrumb(breadcrumb)
  })

  window.analytics.on("identify", function (event, properties, options) {
    const user = {
      id: event,
      username: properties.name,
      email: properties.email,
    }
    Sentry.setUser(user)
  })
}

const LANG_PREFERENCE_KEY = "preferred-lang"
const getPreferredLang = () => {
  return (
    window.localStorage.getItem(LANG_PREFERENCE_KEY) ||
    browserLang({
      languages: ["en", "id"],
      fallback: "en",
    })
  )
}
// For redirecting user to preferred language
export const wrapPageElement = (params) => {
  // find user preferred language
  let preferredLang = getPreferredLang()

  // Generate url with changed language
  const { search } = params.props.location
  const queryParams = search || ""
  let newUrl = withPrefix(
    `${preferredLang === "id" ? "/id" : ""}${
      params.props.pageContext.originalPath
    }${queryParams}`
  )
  // if original path is root, it will introduce trailing slashes
  // this removes it
  if (newUrl === `/${preferredLang}/`) newUrl = "/id"

  // Save the preferred language and navigate away to it
  window.localStorage.setItem(LANG_PREFERENCE_KEY, preferredLang)
  if (
    window.location.pathname + queryParams !== newUrl &&
    window.location.pathname.replace(/\/$/, "") + queryParams !== newUrl
  )
    navigate(newUrl)

  return params.element
}

const detectTouchscreen = () => {
  let hasTouchScreen
  if ("maxTouchPoints" in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0
  } else if ("msMaxTouchPoints" in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0
  } else {
    const mQ = window.matchMedia && matchMedia("(pointer:coarse)")
    if (mQ && mQ.media === "(pointer:coarse)") {
      hasTouchScreen = !!mQ.matches
    } else if ("orientation" in window) {
      hasTouchScreen = true // deprecated, but good fallback
    } else {
      // Only as a last resort, fall back to user agent sniffing
      const UA = navigator.userAgent
      hasTouchScreen =
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
    }
  }
  return hasTouchScreen
}

const loadChatwoot = () => {
  window.chatwootSettings = {
    locale: getPreferredLang(),
  }

  window.addEventListener("chatwoot:ready", function () {
    getApi("/users")().then((user) => {
      window.$chatwoot.setUser(user.id, {
        email: user.email,
        name: user.name,
      })

      getApi(`/schools/${getSchoolId()}`)().then((school) => {
        window.$chatwoot.setCustomAttributes({
          company: school.name,
        })
      })
    })
  })

  setTimeout(() => {
    const t = "script"
    const BASE_URL = "https://app.chatwoot.com"
    const g = document.createElement(t)
    const s = document.getElementsByTagName(t)[0]
    g.src = BASE_URL + "/packs/js/sdk.js"
    g.async = true
    s.parentNode.insertBefore(g, s)
    g.onload = function () {
      let websiteToken
      if (process.env.NODE_ENV === "development") {
        websiteToken = "M3Q1fEiitx7xPHEh12xdvGQR"
      } else {
        websiteToken = "Hs61XyryoFYVv39MienCG2Ei"
      }
      window.chatwootSDK.run({
        websiteToken,
        baseUrl: BASE_URL,
      })
    }
  }, 2000)
}

// Add chatwoot
export const onInitialClientRender = () => {
  const hasTouchScreen = detectTouchscreen()
  if (!hasTouchScreen) {
    loadChatwoot()
  }
}
