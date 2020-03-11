import React, { FC } from "react"
import PageEditSubject from "./PageEditSubject"

export default {
  title: "Core|PageEditSubject",
  component: PageEditSubject,
  parameters: {
    componentSubtitle: "Just a simple PageEditSubject",
  },
}

export const Basic: FC = () => (
  <PageEditSubject areaId="asdfasdf" subjectId="asdfadsfa" />
)
