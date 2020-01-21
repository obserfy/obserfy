import React, { FC } from "react"
import ErrorBoundary from "./ErrorBoundary"
import Box from "../Box/Box"

export default {
  title: "Core|ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    componentSubtitle: "Just a simple ErrorBoundary",
  },
}

export const Basic: FC = () => (
  <ErrorBoundary title="tset">
    <Box>This is rendering something</Box>
  </ErrorBoundary>
)
