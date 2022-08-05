import { action } from "@storybook/addon-actions"
import { FC } from "react"
import NewAreaDialog from "./NewAreaDialog"

export default {
  title: "Basic/Dialog/NewAreaDialog",
  component: NewAreaDialog,
  parameters: {
    componentSubtitle: "Just a simple NewAreaDialog",
  },
}

export const Basic: FC = () => (
  <NewAreaDialog onDismiss={action("dismiss")} curriculumId="" />
)
