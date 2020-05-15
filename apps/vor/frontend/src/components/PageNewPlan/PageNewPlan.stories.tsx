import React, { FC } from "react"
import PageNewPlan from "./PageNewPlan"

export default {
  title: "Core|PageNewPlan",
  component: PageNewPlan,
  parameters: {
    componentSubtitle: "Just a simple PageNewPlan",
  },
}

export const Basic: FC = () => <PageNewPlan />
