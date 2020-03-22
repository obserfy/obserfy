import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DeleteClassDialog from "./DeleteClassDialog"

export default {
  title: "Core|DeleteClassDialog",
  component: DeleteClassDialog,
  parameters: {
    componentSubtitle: "Just a simple DeleteClassDialog",
  },
}

export const Basic: FC = () => (
  <DeleteClassDialog
    name="Mondays"
    classId="asdfafds"
    onDismiss={action("dismiss")}
  />
)
