import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import StudentMaterialProgressDialog from "./StudentMaterialProgressDialog"

export default {
  title: "Core|StudentMaterialProgressDialog",
  component: StudentMaterialProgressDialog,
  parameters: {
    componentSubtitle: "Just a simple StudentMaterialProgressDialog",
  },
}

export const Basic: FC = () => (
  <StudentMaterialProgressDialog
    onDismiss={action("dismiss")}
    materialId="asdfasdf"
    materialName="Fancy Shoelaces"
    studentId="asdfasdf"
    onSubmitted={action("submit")}
  />
)
