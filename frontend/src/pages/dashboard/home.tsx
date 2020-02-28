import React, { FC } from "react"
import PageHome from "../../components/PageHome/PageHome"
import SEO from "../../components/seo"
import { useTitle } from "../../hooks/useTitle"

const IndexPage: FC = () => {
  useTitle("Home")

  return (
    <>
      <SEO title="Home" />
      <PageHome />
    </>
  )
}

export default IndexPage
