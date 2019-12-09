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
    observation={{
      shortDesc: "He so smart",
      id: "",
      categoryId: "",
      createdDate: "",
      longDesc: "He just so smart, nuff said",
      studentId: "",
    }}
    onCancel={action("cancel")}
    onConfirm={action("confirm")}
  />
)
