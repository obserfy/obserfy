import React, { FC } from "react"
import PageRegister from "./PageRegister"

export default {
  title: "Page|PageRegister",
  component: PageRegister,
  parameters: {
    componentSubtitle: "Just a simple PageRegister",
  },
}

export const Basic: FC = () => <PageRegister />
