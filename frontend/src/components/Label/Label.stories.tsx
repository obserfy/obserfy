import React, { FC } from "react"
import Label from "./Label"

export default {
  title: "Core|Typography/Label",
  component: Label,
  parameters: {
    componentSubtitle: "Just a simple Label",
  },
}

export const Basic: FC = () => <Label>Username</Label>
