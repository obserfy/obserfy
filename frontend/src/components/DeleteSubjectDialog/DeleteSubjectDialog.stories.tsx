import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import DeleteSubjectDialog from "./DeleteSubjectDialog"

export default {
  title: "Core|DeleteSubjectDialog",
  component: DeleteSubjectDialog,
  parameters: {
    componentSubtitle: "Just a simple DeleteSubjectDialog",
  },
}

export const Basic: FC = () => (
  <DeleteSubjectDialog
    name="Bank Game"
    onDismiss={action("dismiss")}
    onDeleted={action("delete")}
    subjectId="afdsafsadf"
  />
)
