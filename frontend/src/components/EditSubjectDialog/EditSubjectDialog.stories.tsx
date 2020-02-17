import React, { FC } from "react"
import EditSubjectDialog from "./EditSubjectDialog"

export default {
  title: "Core|EditSubjectDialog",
  component: EditSubjectDialog,
  parameters: {
    componentSubtitle: "Just a simple EditSubjectDialog",
  },
}

export const Basic: FC = () => (
  <EditSubjectDialog
    areaId=""
    subject={{
      materials: [],
      name: "",
      id: "",
      order: 1,
    }}
  />
)
