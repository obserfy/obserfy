import React, { FC } from "react"
import EmptyListPlaceholder from "./EmptyListPlaceholder"

export default {
  title: "Core|EmptyListPlaceholder",
  component: EmptyListPlaceholder,
  parameters: {
    componentSubtitle: "Just a simple EmptyListPlaceholder"
  }
}

export const Basic: FC = () => <EmptyListPlaceholder />
