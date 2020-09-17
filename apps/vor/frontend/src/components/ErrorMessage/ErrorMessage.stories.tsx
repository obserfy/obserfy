import React, { FC } from "react"
import ErrorMessage from "./ErrorMessage"

export default {
  title: "Core/ErrorMessage",
  component: ErrorMessage,
  parameters: {
    componentSubtitle: "Just a simple ErrorMessage",
  },
}

export const Basic: FC = () => (
  <ErrorMessage error={new Error("Are you mad?")} />
)
