import browserLang from "browser-lang"
import "./src/global.css"
import { withPrefix } from "gatsby"

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
// For redirecting user to preferred language
export const wrapPageElement = (params) => {
  // find user preferred language
  let preferredLang =
    window.localStorage.getItem(LANG_PREFERENCE_KEY) ||
    browserLang({
      languages: ["en", "id"],
      fallback: "en",
    })

  // Generate url with changed language
  const { search } = params.props.location
  const queryParams = search || ""
  const newUrl = withPrefix(
    `${preferredLang === "id" ? "/id" : ""}${
      params.props.pageContext.originalPath
    }${queryParams}`
  )

  // Save the preferred language and navigate away to it
  window.localStorage.setItem(LANG_PREFERENCE_KEY, preferredLang)
  if (window.location.pathname + queryParams !== newUrl) {
    console.log(window.location.pathname + queryParams)
    window.location.replace(newUrl)
  }

  return params.element
}
