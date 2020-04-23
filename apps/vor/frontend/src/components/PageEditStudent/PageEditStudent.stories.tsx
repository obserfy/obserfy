import React, { FC } from "react"
import PageEditStudent from "./PageEditStudent"
import Layout from "../Layout/Layout"

export default {
  title: "Page|PageEditStudent",
  component: PageEditStudent,
  parameters: {
    componentSubtitle: "Just a simple PageEditStudent",
  },
}

export const Basic: FC = () => (
  <Layout>
    <PageEditStudent id="jkasdfjaksjdfh" />
  </Layout>
)
