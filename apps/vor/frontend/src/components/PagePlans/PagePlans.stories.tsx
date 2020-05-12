import React, { FC } from "react"
import PagePlans from "./PagePlans"

export default {
  title: "Core|PagePlans",
  component: PagePlans,
  parameters: {
    componentSubtitle: "Just a simple PagePlans",
  },
}

export const Basic: FC = () => <PagePlans />
