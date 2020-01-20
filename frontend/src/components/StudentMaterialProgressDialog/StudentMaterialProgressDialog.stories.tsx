import React, { FC } from "react"
import { action } from "@storybook/addon-actions"
import StudentMaterialProgressDialog from "./StudentMaterialProgressDialog"
import { MaterialProgressStage } from "../../api/useGetStudentMaterialProgress"

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
    progress={{
      lastUpdated: new Date(2020, 1, 2, 1, 1, 1),
      stage: MaterialProgressStage.MASTERED,
      areaId: "Some area",
      materialId: "asdfasfd",
      materialName: "A material",
    }}
  />
)
