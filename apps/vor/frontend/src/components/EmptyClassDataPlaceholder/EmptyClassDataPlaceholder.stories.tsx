import React, { FC } from "react"
import EmptyClassDataPlaceholder from "./EmptyClassDataPlaceholder"

export default {
  title: "Core/EmptyClassDataPlaceholder",
  component: EmptyClassDataPlaceholder,
  parameters: {
    componentSubtitle: "Just a simple EmptyClassDataPlaceholder",
  },
}

export const Basic: FC = () => <EmptyClassDataPlaceholder />
