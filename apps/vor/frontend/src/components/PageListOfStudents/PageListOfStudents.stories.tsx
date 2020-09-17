import React, { FC } from "react"
import PageListOfStudents from "./PageListOfStudents"

export default {
  title: "Core/PageListOfStudents",
  component: PageListOfStudents,
  parameters: {
    componentSubtitle: "Just a simple PageListOfStudents",
  },
}

export const Basic: FC = () => <PageListOfStudents />
