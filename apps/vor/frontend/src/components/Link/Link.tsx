/* eslint-disable no-underscore-dangle */
import { navigate as gatsbyNavigate } from "gatsby"
import { LocalizedLink as Link } from "gatsby-theme-i18n"
import { NavigateOptions } from "@reach/router"

const navigate = (url: string, options?: NavigateOptions<any>) => {
  const defaultLocale = "en"

  let locale = defaultLocale
  if (typeof window !== "undefined" && window.__GATSBY_LOCALE) {
    locale = window.__GATSBY_LOCALE ?? defaultLocale
  }
  const prefix = locale !== defaultLocale ? `/${locale}` : ""

  gatsbyNavigate(prefix + url, options)
}

export { navigate, Link }
