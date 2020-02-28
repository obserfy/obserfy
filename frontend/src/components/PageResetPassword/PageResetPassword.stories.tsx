import React, { FC } from "react"
import PageResetPassword from "./PageResetPassword"

export default {
  title: "Core|PageResetPassword",
  component: PageResetPassword,
  parameters: {
    componentSubtitle: "Just a simple PageResetPassword",
  },
}

export const Basic: FC = () => <PageResetPassword token="sadfsadf" />
