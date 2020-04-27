import React, { FC } from "react"
import PageResetPassword from "./PageResetPassword"

export default {
  title: "Page|PageResetPassword",
  component: PageResetPassword,
  parameters: {
    componentSubtitle: "Just a simple PageResetPassword",
  },
}

export const Basic: FC = () => <PageResetPassword token="sadfsadf" />
