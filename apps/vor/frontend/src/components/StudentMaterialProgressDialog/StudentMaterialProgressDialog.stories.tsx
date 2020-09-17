import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import StudentMaterialProgressDialog from "./StudentMaterialProgressDialog"

export default {
  title: "Basic/Dialog/StudentMaterialProgressDialog",
  component: StudentMaterialProgressDialog,
  parameters: {
    componentSubtitle: "Just a simple StudentMaterialProgressDialog",
  },
}

export const Basic: FC = () => (
  <StudentMaterialProgressDialog
    lastUpdated={new Date(2018, 5, 27, 0, 0, 0).toISOString()}
    onDismiss={action("dismiss")}
    materialId="asdfasdf"
    materialName="Fancy Shoelaces"
    studentId="asdfasdf"
    onSubmitted={action("submit")}
  />
)
