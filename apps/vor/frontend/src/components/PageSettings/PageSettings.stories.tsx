import React, { FC } from "react"
import PageSettings from "./PageSettings"

export default {
  title: "Page|PageSettings",
  component: PageSettings,
  parameters: {
    componentSubtitle: "Just a simple PageSettings",
  },
}

export const Basic: FC = () => <PageSettings />
