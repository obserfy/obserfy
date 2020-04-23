import React, { FC } from "react"
import PageNewObservation from "./PageNewObservation"

export default {
  title: "Page|PageNewObservation",
  component: PageNewObservation,
  parameters: {
    componentSubtitle: "Just a simple PageNewObservation",
  },
}

export const Basic: FC = () => <PageNewObservation studentId="" />
