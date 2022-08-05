import { action } from "@storybook/addon-actions"
import { FC } from "react"
import NewStudentDialog from "./NewStudentDialog"

export default {
  title: "Basic/Dialog/NewStudentDialog",
  component: NewStudentDialog,
  parameters: {
    componentSubtitle: "Just a simple NewStudentDialog",
  },
}

export const Basic: FC = () => (
  <NewStudentDialog onCancel={action("Cancel")} onConfirm={action("Confirm")} />
)
