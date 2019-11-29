import React, { FC } from "react"
import Checkbox from "./Checkbox"

export default {
  title: "Core|Forms/Checkbox",
  component: Checkbox,
  parameters: {
    componentSubtitle: "Just a simple Checkbox"
  }
}

export const Basic: FC = () => <Checkbox />
