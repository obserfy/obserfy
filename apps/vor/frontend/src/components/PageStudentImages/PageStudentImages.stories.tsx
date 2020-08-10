import React, { FC } from "react"
import PageStudentImages from "./PageStudentImages"

export default {
  title: "Core|PageStudentImages",
  component: PageStudentImages,
  parameters: {
    componentSubtitle: "Just a simple PageStudentImages",
  },
}

export const Basic: FC = () => <PageStudentImages studentId="" />
