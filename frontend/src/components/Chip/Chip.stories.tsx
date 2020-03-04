import React, { FC } from "react"
import Chip from "./Chip"

export default {
  title: "Core|Chip",
  component: Chip,
  parameters: {
    componentSubtitle: "Just a simple Chip",
  },
}

export const Basic: FC = () => (
  <Chip activeBackground="primary" text="Help" isActive />
)
