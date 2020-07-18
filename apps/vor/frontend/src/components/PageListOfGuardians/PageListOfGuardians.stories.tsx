import React, { FC } from "react"
import PageListOfGuardians from "./PageListOfGuardians"

export default {
  title: "Core|PageListOfGuardians",
  component: PageListOfGuardians,
  parameters: {
    componentSubtitle: "Just a simple PageListOfGuardians",
  },
}

export const Basic: FC = () => <PageListOfGuardians />
