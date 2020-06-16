import React, { FC } from "react"
import { Box } from "theme-ui"
import ErrorBoundary from "./ErrorBoundary"

export default {
  title: "Core|ErrorBoundary",
  component: ErrorBoundary,
  parameters: {
    componentSubtitle: "Just a simple ErrorBoundary",
  },
}

export const Basic: FC = () => (
  <ErrorBoundary>
    <Box>This is rendering something</Box>
  </ErrorBoundary>
)
