import React, { FC } from "react"
import Pill from "./Pill"

export default {
  title: "Core/Pill",
  component: Pill,
  parameters: {
    componentSubtitle: "Just a simple Pill",
  },
}

export const Basic: FC = () => <Pill text="You" />
