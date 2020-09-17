import React, { FC } from "react"
import StudentsList from "./StudentsList"

export default {
  title: "Core/StudentsList",
  component: StudentsList,
  parameters: {
    componentSubtitle: "Just a simple StudentsList",
  },
}

export const Basic: FC = () => <StudentsList />
