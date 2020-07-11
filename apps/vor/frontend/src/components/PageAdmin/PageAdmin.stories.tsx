import React, { FC } from "react"
import PageAdmin from "./PageAdmin"

export default {
  title: "Core|PageAdmin",
  component: PageAdmin,
  parameters: {
    componentSubtitle: "Just a simple PageAdmin",
  },
}

export const Basic: FC = () => <PageAdmin />
