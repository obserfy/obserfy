import React, { FC } from "react"
import PageHome from "./PageHome"

export default {
  title: "Page|PageHome",
  component: PageHome,
  parameters: {
    componentSubtitle: "Just a simple PageHome",
  },
}

export const Basic: FC = () => <PageHome />
