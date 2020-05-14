import React, { FC } from "react"
import PagePlans from "./PagePlans"
import Layout from "../Layout/Layout"

export default {
  title: "Core|PagePlans",
  component: PagePlans,
  parameters: {
    componentSubtitle: "Just a simple PagePlans",
  },
}

export const Basic: FC = () => <PagePlans />
export const WithLayout: FC = () => (
  <Layout>
    <PagePlans />
  </Layout>
)
