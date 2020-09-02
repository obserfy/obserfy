import React, { FC } from "react"
import BackNavigation from "./BackNavigation"

export default {
  title: "Basic/BackNavigation",
  component: BackNavigation,
  parameters: {
    componentSubtitle: "Just a simple BackNavigation",
  },
}

export const Basic: FC = () => <BackNavigation to="/" text="Home" />
