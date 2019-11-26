import React, { FC } from "react"
import Layout from "./Layout"

export default {
  title: "Basic|Layout",
  component: Layout,
  parameters: {
    componentSubtitle: "Just a simple Layout"
  }
}

export const Basic: FC = () => <Layout pageTitle="Home" />
