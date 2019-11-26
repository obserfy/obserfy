import React, { FC } from "react"
import AppBar from "./AppBar"

export default {
  title: "Complex|AppBar",
  component: AppBar,
  parameters: {
    componentSubtitle: "Just a simple AppBar"
  }
}

export const Basic: FC = () => {
  return <AppBar title="Home" />
}
