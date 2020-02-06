import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import NewAreaDialog from "./NewAreaDialog"

export default {
  title: "Core|NewAreaDialog",
  component: NewAreaDialog,
  parameters: {
    componentSubtitle: "Just a simple NewAreaDialog",
  },
}

export const Basic: FC = () => (
  <NewAreaDialog onDismiss={action("dismiss")} onSaved={action("Saved")} />
)
