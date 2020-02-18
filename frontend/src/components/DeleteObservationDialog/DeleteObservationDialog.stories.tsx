import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DeleteObservationDialog from "./DeleteObservationDialog"

export default {
  title: "Core|DeleteObservationDialog",
  component: DeleteObservationDialog,
  parameters: {
    componentSubtitle: "Just a simple DeleteObservationDialog",
  },
}

export const Basic: FC = () => (
  <DeleteObservationDialog
    onDismiss={action("dismiss")}
    onDeleted={action("deleted")}
    observationId="sadfasdf"
    shortDesc="adsfasdfadsf"
  />
)
