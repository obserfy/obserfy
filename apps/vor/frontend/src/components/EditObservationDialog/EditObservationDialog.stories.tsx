import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import EditObservationDialog from "./EditObservationDialog"

export default {
  title: "Basic/Dialog/EditObservationDialog",
  component: EditObservationDialog,
  parameters: {
    componentSubtitle: "Just a simple EditObservationDialog",
  },
}

export const Basic: FC = () => (
  <EditObservationDialog
    onDismiss={action("dismiss")}
    onSaved={action("saved")}
  />
)
