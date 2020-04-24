import React, { FC } from "react"
import TextArea from "./TextArea"

export default {
  title: "Core|Forms/TextArea",
  component: TextArea,
  parameters: {
    componentSubtitle: "Just a simple TextArea",
  },
}

export const Basic: FC = () => <TextArea />
