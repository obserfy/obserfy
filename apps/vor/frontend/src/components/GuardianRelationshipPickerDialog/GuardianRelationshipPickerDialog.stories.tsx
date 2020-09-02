import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import GuardianRelationshipPickerDialog from "./GuardianRelationshipPickerDialog"

export default {
  title: "Core/GuardianRelationshipPickerDialog",
  component: GuardianRelationshipPickerDialog,
  parameters: {
    componentSubtitle: "Just a simple GuardianRelationshipPickerDialog",
  },
}

export const Basic: FC = () => (
  <GuardianRelationshipPickerDialog
    onAccept={action("accept")}
    onDismiss={action("dismiss")}
  />
)
