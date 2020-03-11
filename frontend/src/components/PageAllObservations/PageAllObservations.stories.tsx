import React, { FC } from "react"
import PageAllObservations from "./PageAllObservations"

export default {
  title: "Page|PageAllObservations",
  component: PageAllObservations,
  parameters: {
    componentSubtitle: "Just a simple PageAllObservations",
  },
}

export const Basic: FC = () => <PageAllObservations studentId="sadfasdf" />
