import React, { FC, useContext } from "react"
import PageHome from "../components/PageHome/PageHome"
import SEO from "../components/seo"
import { PageTitleContext } from "../layouts"

const IndexPage: FC = () => {
  const pageTitle = useContext(PageTitleContext)
  pageTitle.setTitle("Home")
  return (
    <>
      <SEO title="Home" />
      <PageHome />
    </>
  )
}

export default IndexPage
