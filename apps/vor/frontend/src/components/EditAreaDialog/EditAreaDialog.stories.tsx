import { FC } from "react"
import { action } from "@storybook/addon-actions"
import EditAreaDialog from "./EditAreaDialog"

export default {
  title: "Basic/Dialog/EditAreaDialog",
  component: EditAreaDialog,
  parameters: {
    componentSubtitle: "Just a simple EditAreaDialog",
  },
}

export const Basic: FC = () => (
  <EditAreaDialog
    areaId="adsfaf"
    originalName="Practical Life"
    onSaved={action("save")}
    onDismiss={action("dismiss")}
  />
)
