import React, { FC } from "react"
import PagePlanDetails from "./PagePlanDetails"
import Layout from "../Layout/Layout"

export default {
  title: "Page|Plans/PagePlanDetails",
  component: PagePlanDetails,
  parameters: {
    componentSubtitle: "Just a simple PagePlanDetails",
  },
}

export const Basic: FC = () => <PagePlanDetails />

export const WithLayout: FC = () => {
  return (
    <Layout>
      <PagePlanDetails />
    </Layout>
  )
}
