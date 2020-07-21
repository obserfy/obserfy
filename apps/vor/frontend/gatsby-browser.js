/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import "./src/global.css"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const shouldUpdateScroll = ({
  prevRouterProps: { location },
  routerProps,
  getSavedScrollPosition,
}) => {
  // =============== What is all of this??? ==============================
  // This is a simple hack to preserve scroll position for some navigation links
  // (such as link for going back and bottom navigation link).

  // Get scroll position of the current page the user in
  const lastPosition = getSavedScrollPosition(location)
  // undocumented internals.
  window.sessionStorage.setItem(
    `@@scroll|${location.pathname}`,
    JSON.stringify(lastPosition)
  )

  // If state.preserveScroll is true, we'll use the last known
  // scroll position of the given pathname, and scroll to it.
  if (routerProps.location.state?.preserveScroll) {
    const currentPosition = window.sessionStorage.getItem(
      `@@scroll|${routerProps.location.pathname}`
    )
    const position = JSON.parse(currentPosition)
    window.scrollTo(...(position || [0, 0]))
    return false
  }

  return true
}

export const onServiceWorkerUpdateReady = () => {
  if (window.updateAvailable) {
    window.updateAvailable()
  }
}