import React, { FC } from "react"
import PageClassSettings from "./PageClassSettings"

export default {
  title: "Core|PageClassSettings",
  component: PageClassSettings,
  parameters: {
    componentSubtitle: "Just a simple PageClassSettings",
  },
}

export const Basic: FC = () => <PageClassSettings />
