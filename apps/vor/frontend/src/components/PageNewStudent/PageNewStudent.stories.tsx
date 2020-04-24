import React, { FC } from "react"
import PageNewStudent from "./PageNewStudent"

export default {
  title: "Page|PageNewStudent",
  component: PageNewStudent,
  parameters: {
    componentSubtitle: "Just a simple PageNewStudent",
  },
}

export const Basic: FC = () => <PageNewStudent />
