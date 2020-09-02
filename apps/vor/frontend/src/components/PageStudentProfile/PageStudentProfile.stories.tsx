import React, { FC } from "react"
import PageStudentProfile from "./PageStudentProfile"

export default {
  title: "Core/PageStudentProfile",
  component: PageStudentProfile,
  parameters: {
    componentSubtitle: "Just a simple PageStudentProfile",
  },
}

export const Basic: FC = () => <PageStudentProfile id="asdfasdf" />
