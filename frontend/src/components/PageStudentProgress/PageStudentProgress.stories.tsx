import React, { FC } from "react"
import PageStudentProgress from "./PageStudentProgress"

export default {
  title: "Core|PageStudentProgress",
  component: PageStudentProgress,
  parameters: {
    componentSubtitle: "Just a simple PageStudentProgress",
  },
}

export const Basic: FC = () => (
  <PageStudentProgress areaId="asdfasfd" studentId="asdfadsf" />
)
