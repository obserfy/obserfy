import React, { FC } from "react"
import StudentPicturePlaceholder from "./StudentPicturePlaceholder"

export default {
  title: "Core|StudentPicturePlaceholder",
  component: StudentPicturePlaceholder,
  parameters: {
    componentSubtitle: "Just a simple StudentPicturePlaceholder",
  },
}

export const Basic: FC = () => <StudentPicturePlaceholder />
