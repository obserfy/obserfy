import React, { FC } from "react"
import Portal from "./Portal"

export default {
  title: "Core/Portal",
  component: Portal,
  parameters: {
    componentSubtitle: "Just a simple Portal",
  },
}

export const Basic: FC = () => <Portal />
