import React, { FC } from "react"
import PageLogin from "./PageLogin"

export default {
  title: "Page/PageLogin",
  component: PageLogin,
  parameters: {
    componentSubtitle: "Just a simple PageLogin",
  },
}

export const Basic: FC = () => <PageLogin />
