import React, { FC } from "react"
import PageHome from "./PageHome"
import { Layout } from "../Layout/Layout"

export default {
  title: "Core|PageHome",
  component: PageHome,
  parameters: {
    componentSubtitle: "Just a simple PageHome",
  },
}

export const Basic: FC = () => (
  <Layout pageTitle="Home">
    <PageHome />
  </Layout>
)
