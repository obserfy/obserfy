import React, { FC } from "react"
import PageEditClass from "./PageEditClass"

export default {
  title: "Core|PageEditClass",
  component: PageEditClass,
  parameters: {
    componentSubtitle: "Just a simple PageEditClass",
  },
}

export const Basic: FC = () => <PageEditClass classId="asdfasdfa" />
