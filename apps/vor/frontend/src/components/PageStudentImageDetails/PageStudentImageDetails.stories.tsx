import React, { FC } from "react"
import PageStudentImageDetails from "./PageStudentImageDetails"

export default {
  title: "Core|PageStudentImageDetails",
  component: PageStudentImageDetails,
  parameters: {
    componentSubtitle: "Just a simple PageStudentImageDetails",
  },
}

export const Basic: FC = () => (
  <PageStudentImageDetails imageId="asdfasdf" studentId="asdfasdf" />
)
