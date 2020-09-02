import React, { FC } from "react"
import LoadingIndicator from "./LoadingIndicator"

export default {
  title: "Core/LoadingIndicator",
  component: LoadingIndicator,
  parameters: {
    componentSubtitle: "Just a simple LoadingIndicator",
  },
}

export const Basic: FC = () => <LoadingIndicator size={24} />
