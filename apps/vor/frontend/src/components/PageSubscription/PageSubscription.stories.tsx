import React, { FC } from "react"
import PageSubscription from "./PageSubscription"

export default {
  title: "Core/PageSubscription",
  component: PageSubscription,
  parameters: {
    componentSubtitle: "Just a simple PageSubscription",
  },
}

export const Basic: FC = () => <PageSubscription />
