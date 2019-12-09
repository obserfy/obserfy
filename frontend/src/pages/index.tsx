import React, { FC } from "react"
import Layout from "../components/Layout/Layout"
import PageHome from "../components/PageHome/PageHome"
import SEO from "../components/seo"

const IndexPage: FC = () => (
  <Layout pageTitle="Home">
    <SEO title="Home" />
    <PageHome />
  </Layout>
)

export default IndexPage
