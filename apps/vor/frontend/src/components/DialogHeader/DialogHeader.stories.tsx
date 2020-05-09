import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DialogHeader from "./DialogHeader"

export default {
  title: "Core|DialogHeader",
  component: DialogHeader,
  parameters: {
    componentSubtitle: "Just a simple DialogHeader",
  },
}

export const Basic: FC = () => (
  <DialogHeader
    onAccept={action("accept")}
    title="A Dialog"
    onAcceptText="Save"
    onCancel={action("cancel")}
  />
)
