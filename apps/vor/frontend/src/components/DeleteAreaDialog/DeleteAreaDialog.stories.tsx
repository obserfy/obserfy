import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DeleteAreaDialog from "./DeleteAreaDialog"

export default {
  title: "Basic/Dialog/DeleteAreaDialog",
  component: DeleteAreaDialog,
  parameters: {
    componentSubtitle: "Just a simple DeleteAreaDialog",
  },
}

export const Basic: FC = () => (
  <DeleteAreaDialog
    areaId="adsf"
    name="Practical Life"
    onDismiss={action("dismiss")}
    onDeleted={action("delete")}
  />
)
