import React, { FC } from "react"
import PageUsers from "./PageUsers"

export default {
  title: "Page/PageUsers",
  component: PageUsers,
  parameters: {
    componentSubtitle: "Just a simple PageUsers",
  },
}

export const Basic: FC = () => <PageUsers />
