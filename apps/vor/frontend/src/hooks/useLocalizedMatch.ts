import { useMatch } from "@reach/router"
import { useLocalization } from "gatsby-theme-i18n"

const useLocalizedMatch = (pathname: string) => {
  const { locale } = useLocalization()
  const localePrefix = locale !== "en" ? `/${locale}` : ""

  return useMatch(localePrefix + pathname)
}

export default useLocalizedMatch
