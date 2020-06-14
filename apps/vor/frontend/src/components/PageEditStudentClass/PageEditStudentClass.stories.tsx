import React, { FC } from "react"
import PageEditStudentClass from "./PageEditStudentClass"

export default {
  title: "Core|PageEditStudentClass",
  component: PageEditStudentClass,
  parameters: {
    componentSubtitle: "Just a simple PageEditStudentClass",
  },
}

export const Basic: FC = () => <PageEditStudentClass studentId="asdfasfd" />
