import React, { FC } from "react"
import PageHome from "../../../components/PageHome/PageHome"
import SEO from "../../../components/seo"

export const OBSERVE_PAGE_URL = "/dashboard/observe"

const IndexPage: FC = () => {
  return (
    <>
      <SEO title="Home" />
      <PageHome />
    </>
  )
}

export default IndexPage
