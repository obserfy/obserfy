import React, { FC } from "react"
import NewStudentDialog from "./NewStudentDialog"

export default {
  title: "Core|NewStudentDialog",
  component: NewStudentDialog,
  parameters: {
    componentSubtitle: "Just a simple NewStudentDialog"
  }
}

export const Basic: FC = () => <NewStudentDialog />
