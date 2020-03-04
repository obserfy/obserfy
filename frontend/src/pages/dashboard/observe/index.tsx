import React, { FC } from "react"
import PageHome from "../../../components/PageHome/PageHome"
import SEO from "../../../components/seo"

const IndexPage: FC = () => {
  return (
    <>
      <SEO title="Home" />
      <PageHome />
    </>
  )
}

export default IndexPage
