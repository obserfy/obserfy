import React, { FC } from "react"
import Layout from "../components/Layout/Layout"
import PageHome from "../components/PageHome/PageHome"

const IndexPage: FC = () => (
  <Layout pageTitle="Home">
    <PageHome />
  </Layout>
)

export default IndexPage
