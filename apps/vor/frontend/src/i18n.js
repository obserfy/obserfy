import browserLang from "browser-lang"
import { navigate, withPrefix } from "gatsby"

const LANG_PREFERENCE_KEY = "preferred-lang"

export const getPreferredLang = () => {
  return (
    window.localStorage.getItem(LANG_PREFERENCE_KEY) ||
    browserLang({
      languages: ["en", "id"],
      fallback: "en",
    })
  )
}

export const redirectToPreferredLang = (location, originalPath) => {
  // find user preferred language
  const preferredLang = getPreferredLang()

  // Generate url with changed language
  const { search } = location
  const queryParams = search || ""
  let newUrl = withPrefix(
    `${preferredLang === "id" ? "/id" : ""}${originalPath}${queryParams}`
  )
  // if original path is root, it will introduce trailing slashes
  // this removes it
  if (newUrl === `/${preferredLang}/`) newUrl = "/id"

  // Save the preferred language and navigate away to it
  window.localStorage.setItem(LANG_PREFERENCE_KEY, preferredLang)
  if (
    window.location.pathname + queryParams !== newUrl &&
    window.location.pathname.replace(/\/$/, "") + queryParams !== newUrl &&
    !newUrl.endsWith("/404")
  ) {
    navigate(newUrl, { replace: true })
  }
}
