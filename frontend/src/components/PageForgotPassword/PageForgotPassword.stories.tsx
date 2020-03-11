import React, { FC } from "react"
import PageForgotPassword from "./PageForgotPassword"

export default {
  title: "Page|PageForgotPassword",
  component: PageForgotPassword,
  parameters: {
    componentSubtitle: "Just a simple PageForgotPassword",
  },
}

export const Basic: FC = () => <PageForgotPassword />
