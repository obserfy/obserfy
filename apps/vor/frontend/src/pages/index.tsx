import { PageRendererProps, navigate } from "gatsby"
import React, { FC, useEffect } from "react"
import { useLocalization } from "gatsby-theme-i18n"
import { STUDENTS_URL } from "../routes"

const IndexPage: FC<PageRendererProps> = () => {
  const { locale } = useLocalization()
  // TODO: replace with gatsby's newly exported Redirect component when it lands
  //  (gatsby #26046)
  useEffect(() => {
    // TODO: these locale conversion is pretty common, abstract it away
    navigate((locale !== "en" ? `/${locale}` : "") + STUDENTS_URL)
  }, [])
  return <div />
}

export default IndexPage
