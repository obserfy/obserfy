import React, { FC } from "react"
import PageNewClass from "./PageNewClass"

export default {
  title: "Core/PageNewClass",
  component: PageNewClass,
  parameters: {
    componentSubtitle: "Just a simple PageNewClass",
  },
}

export const Basic: FC = () => <PageNewClass />
