import React, { FC } from "react"
import PageError from "./PageError"

export default {
  title: "Core|PageError",
  component: PageError,
  parameters: {
    componentSubtitle: "Just a simple PageError"
  }
}

export const Basic: FC = () => <PageError />
