import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DeleteStudentDialog from "./DeleteStudentDialog"

export default {
  title: "Basic/Dialog/DeleteStudentDialog",
  component: DeleteStudentDialog,
  parameters: {
    componentSubtitle: "Just a simple DeleteStudentDialog",
  },
}

export const Basic: FC = () => (
  <DeleteStudentDialog
    onCancel={action("cancel")}
    onConfirm={action("confirm")}
    student={{ id: "idwanttoloveyou", name: "Igor Persnyakhovich" }}
  />
)
