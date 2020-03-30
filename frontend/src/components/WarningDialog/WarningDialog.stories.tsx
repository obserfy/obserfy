import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import WarningDialog from "./WarningDialog"

export default {
  title: "Basic|Dialog/WarningDialog",
  component: WarningDialog,
  parameters: {
    componentSubtitle: "Just a simple WarningDialog",
  },
}

export const Basic: FC = () => (
  <WarningDialog
    onAccept={action("accept")}
    onDismiss={action("dismiss")}
    description={"Don't do that pliz"}
    title="What are you doing?"
  />
)
