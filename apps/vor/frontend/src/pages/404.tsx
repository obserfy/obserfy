import { FC } from "react"
import SEO from "../components/seo"
import Page404 from "../components/Page404/Page404"

export const Custom404: FC = () => (
  <>
    <SEO title="Page not found" />
    <Page404 />
  </>
)

export default Custom404
