import { t } from "@lingui/macro"
import { PageRendererProps } from "gatsby"
import { FC, useEffect } from "react"
import { navigate } from "../components/Link/Link"
import SEO from "../components/seo"
import { STUDENTS_URL } from "../routes"

const IndexPage: FC<PageRendererProps> = () => {
  // TODO: replace with gatsby-link <Redirect /> when it lands, gatsby #26046
  useEffect(() => {
    navigate(STUDENTS_URL, { replace: true })
  }, [])

  return <SEO title={t`Home`} />
}

export default IndexPage
