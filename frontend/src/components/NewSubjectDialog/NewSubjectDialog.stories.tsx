import React, { FC } from "react"
import NewSubjectDialog from "./NewSubjectDialog"

export default {
  title: "Core|NewSubjectDialog",
  component: NewSubjectDialog,
  parameters: {
    componentSubtitle: "Just a simple NewSubjectDialog",
  },
}

export const Basic: FC = () => <NewSubjectDialog />
