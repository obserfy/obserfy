import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import NewSubjectDialog from "./NewSubjectDialog"

export default {
  title: "Core|NewSubjectDialog",
  component: NewSubjectDialog,
  parameters: {
    componentSubtitle: "Just a simple NewSubjectDialog",
  },
}

export const Basic: FC = () => (
  <NewSubjectDialog
    areaId="asdasd"
    onDismiss={action("Dismiss")}
    onSaved={action("onSaved")}
  />
)
