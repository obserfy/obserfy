import React, { FC } from "react"
import Input from "./Input"

export default {
  title: "Core|Forms/Input",
  component: Input,
  parameters: {
    componentSubtitle: "Just a simple Input",
  },
}

export const Basic: FC = () => <Input aria-label="email" name="name" />
